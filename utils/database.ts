import * as SQLite from 'expo-sqlite';

export interface Medication {
    id?: number;
    name: string;
    dose: string;
    freq: string;
    times: string[];
    selectedDays?: number[];
    instructions: string;
    color: string;
    startDate: string;
    endDate?: string;
    isActive: boolean;
}

export interface MedicationLog {
    id?: number;
    medicationId: number;
    scheduledTime: string;
    actualTime?: string;
    date: string; 
    status: 'taken' | 'missed' | 'skipped';
    createdAt: string;    
}

class DatabaseManager {
    private db: SQLite.SQLiteDatabase | null = null;
    private isInit: boolean = false;

    async initDatabase(): Promise<void> {
        if (this.isInit && this.db) {
            return;
        }
        try {
        this.db = await SQLite.openDatabaseAsync('medications.db');
        await this.db.execAsync(`
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS medications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                dose TEXT NOT NULL,
                freq TEXT NOT NULL,
                times TEXT NOT NULL,
                selected TEXT NOT NULL,
                instructions TEXT,
                color TEXT NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                is_active INTEGER DEFAULT 1
            );

            PRAGMA table_info(medications);
        `)  
        this.isInit = true;
        console.log('Database initialized'); 
        } 
        catch (error) {
            console.error('Database no initialize :C', error)
            this.isInit = false;
            this.db = null;
            throw new Error('failed to init db');
        }
    }

    async ensureInit(): Promise<void> {
        if (!this.isInit || !this.db) {
            await this.initDatabase;
        }
    }

    async addMedication(medication: Omit<Medication, 'id'>): Promise<number> {
        try {
            if (!this.db) throw new Error('db not init');
            const result = await this.db.runAsync(
                `INSERT INTO medications (name, dose, freq, times, selected_days, instructions, color, start_date, end_date, is_active) 
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [medication.name, medication.dose, medication.freq, JSON.stringify(medication.times), medication.selectedDays ? JSON.stringify(medication.selectedDays): null, 
                    medication.instructions, medication.color, medication.startDate, medication.endDate || null, new Date().toISOString(), medication.isActive ? 1 : 0
                ]
            );
            return result.lastInsertRowId;
        }
        catch (error) {
            console.error('add med error', error);
            throw new Error('failed to add med');
        }
    }
    async getMedications(): Promise<Medication[]> {
        await this.ensureInit();
        if (!this.db) throw new Error('db not init');
        try {
            const rows = await this.db.getAllAsync(
                `SELECT * FROM medications WHERE is_active = 1`
            );
            return rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                dose: row.dose,
                freq: row.freq,
                times: JSON.parse(row.times),
                selectedDays: row.selected_days ? JSON.parse(row.selected_days) : undefined,
                instructions: row.instructions || ``,
                color: row.color,
                startDate: row.start_date,
                endDate: row.end_date,
                isActive: row.is_active === 1
            }));
        }
        catch (error) {
            console.error('get meds error:', error);
            throw new Error('failed to get meds');
        }
    }
    async getMedicationsForDate(date: string): Promise<Medication[]> {
        await this.ensureInit();
        if (!this.db) {
            throw new Error('database not init');
        }
        try {
            const medications = await this.getMedications();
            return medications.filter(med => {
                const startDate = new Date(med.startDate);
                const endDate = med.endDate ? new Date(med.endDate) : null;
                const targetDate = new Date(date);
                
                if (targetDate < startDate || (endDate && targetDate > endDate)) {
                    return false;
                }
                if (med.freq === 'weekly' && med.selectedDays && med.selectedDays.length > 0) {
                    const dayOfWeek = targetDate.getDay();
                    return med.selectedDays.includes(dayOfWeek);
                }  
                return true;  
            });
        }
        catch (error) {
            console.error('couldnt get ur meds for tdy yo: ', error);
            throw new Error('couldnt get meds tdy');
        }
    }
    async updateMedication(id: number, medication: Partial<Medication>): Promise<void> {
        await this.ensureInit();
        if (!this.db) {
            throw new Error('database not init');
        }
        try {

        }
        catch (error) {
            
        }
    }
}

export const databaseManager = new DatabaseManager();
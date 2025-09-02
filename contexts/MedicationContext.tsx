import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { databaseManager, Medication, MedicationLog } from '@/utils/database';

interface MedicationContextType {
  medications: Medication[];
  loading: boolean;
  error: string | null;
  addMedication: (medication: Omit<Medication, 'id' | 'createdAt'>) => Promise<void>;
  updateMedication: (id: number, medication: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: number) => Promise<void>;
  getMedicationsForDate: (date: string) => Promise<Medication[]>;
  logMedication: (log: Omit<MedicationLog, 'id' | 'createdAt'>) => Promise<void>;
  refreshMedications: () => Promise<void>;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      await databaseManager.initDatabase();
      await refreshMedications();
    } catch (error) {
      console.error('database init failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshMedications = async () => {
    try {
      setError(null);
      const meds = await databaseManager.getMedications();
      setMedications(meds);
    } catch (error) {
      console.error('refresh failed:', error);
    }
  };

  const addMedication = async (medication: Omit<Medication, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      await databaseManager.initDatabase();
      await databaseManager.addMedication(medication);
      await refreshMedications();
    } catch (error) {
      console.error('add medication failed:', error);
    }
  };

  const updateMedication = async (id: number, medication: Partial<Medication>) => {
    try {
      setError(null);
      await databaseManager.updateMedication(id, medication);
      await refreshMedications();
    } catch (error) {
      console.error('update failed:', error);
    }
  };

  const deleteMedication = async (id: number) => {
    try {
      setError(null);
      await databaseManager.deleteMedication(id);
      await refreshMedications();
    } catch (error) {
      console.error('delete failed:', error);
    }
  };

  const getMedicationsForDate = async (date: string): Promise<Medication[]> => {
    try {
      return await databaseManager.getMedicationsForDate(date);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'failed to get medications';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logMedication = async (log: Omit<MedicationLog, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      await databaseManager.logMedication(log);
    } catch (error) {
      console.error('log failed:', error);
    }
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  const value: MedicationContextType = {
    medications,
    loading,
    error,
    addMedication,
    updateMedication,
    deleteMedication,
    getMedicationsForDate,
    logMedication,
    refreshMedications,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};

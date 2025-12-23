import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Patient {
    id: string;
    name: string;
    age: number;
    lastVisit: string;
    status?: string;
    riskLevel?: string;
    confidence?: number;
    description?: string;
    reports?: MedicalReport[];
}

export interface MedicalReport {
    id: string;
    patientId: string;
    date: string;
    description: string;
    imageUrl: string;
    fileName: string;
    fileType?: 'image' | 'pdf';
    diagnosis?: string;
    confidence?: number;
}

interface PatientContextType {
    patients: Patient[];
    addPatient: (patient: Patient) => void;
    updatePatient: (id: string, patient: Partial<Patient>) => void;
    getPatient: (id: string) => Patient | undefined;
    addReport: (patientId: string, report: MedicalReport) => void;
    getPatientReports: (patientId: string) => MedicalReport[];
    refreshPatients: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000';

export const PatientProvider = ({ children }: { children: ReactNode }) => {
    const [patients, setPatients] = useState<Patient[]>([]);

    // Fetch patients from the API
    const refreshPatients = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/get_patients`);
            const data = await response.json();

            if (data.success && data.patients) {
                setPatients(data.patients.map((p: any) => ({
                    ...p,
                    reports: []
                })));
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    // Fetch patients on mount
    useEffect(() => {
        refreshPatients();
    }, []);

    const addPatient = (patient: Patient) => {
        setPatients(prev => [...prev, { ...patient, reports: [] }]);
    };

    const updatePatient = (id: string, updatedData: Partial<Patient>) => {
        setPatients(prev =>
            prev.map(patient =>
                patient.id === id ? { ...patient, ...updatedData } : patient
            )
        );
    };

    const getPatient = (id: string) => {
        return patients.find(patient => patient.id === id);
    };

    const addReport = (patientId: string, report: MedicalReport) => {
        setPatients(prev =>
            prev.map(patient =>
                patient.id === patientId
                    ? {
                        ...patient,
                        reports: [...(patient.reports || []), report],
                        lastVisit: report.date,
                    }
                    : patient
            )
        );
    };

    const getPatientReports = (patientId: string) => {
        const patient = patients.find(p => p.id === patientId);
        return patient?.reports || [];
    };

    return (
        <PatientContext.Provider value={{
            patients,
            addPatient,
            updatePatient,
            getPatient,
            addReport,
            getPatientReports,
            refreshPatients
        }}>
            {children}
        </PatientContext.Provider>
    );
};

export const usePatients = () => {
    const context = useContext(PatientContext);
    if (!context) {
        throw new Error('usePatients must be used within PatientProvider');
    }
    return context;
};

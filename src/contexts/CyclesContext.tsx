import { createContext, useState, type ReactNode, useReducer } from "react";
import { cyclesReducer, type Cycle } from "../reducers/cycles/reducer";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";

//useReducer -> funciona como o useState porém para armazenar informações mais complexas

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    amountSecondsPassed: number;
    setAmountSecondsPassed: React.Dispatch<React.SetStateAction<number>>;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
    children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(cyclesReducer, {
        cycles: [],
        activeCycleId: null
    });

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const { cycles, activeCycleId } = cyclesState;

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch(addNewCycleAction(newCycle))

        setAmountSecondsPassed(0);
    }

    function interruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction())
    }

    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    return (
        <CyclesContext.Provider value={{
            cycles,
            activeCycle,
            activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setAmountSecondsPassed,
            createNewCycle,
            interruptCurrentCycle
        }}>
            {children}
        </CyclesContext.Provider>
    )
}
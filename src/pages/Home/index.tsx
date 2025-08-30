import { Hand, Play } from "lucide-react";

import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";

import { createContext, useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";

// Prop Drilling -> Quando a gente tem MUITAS props APENAS para comunicação entre componentes
// Context API -> Permite compartilharmos informações entre VÁRIOS componentes ao mesmo tempo
// O ideal é manter no contexto variáveis ou funções que não vão mudar se a gente, por exemplo, trocar uma biblioteca
// React-Hook-Form tem seu próprio contexto chamado de FormProvider

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod.number().min(1, "O ciclo precisa de no mínimo 1 minuto").max(60, "O ciclo precisa ser de no máximo 60 minutos")
});

// interface NewCycleFormData {
//     task: string
//     minutesAmount: number
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void;
    amountSecondsPassed: number;
    setAmountSecondsPassed: React.Dispatch<React.SetStateAction<number>>;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0
        }
    });
    const { handleSubmit, watch, reset } = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles((state) => [...state, newCycle]);
        setActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);

        reset();
    }

    function handleInterruptCycle() {
        setCycles(state => state.map(cycle => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, interruptDate: new Date() }
            } else {
                return cycle
            }
        }));

        setActiveCycleId(null);
    }

    function markCurrentCycleAsFinished() {
        setCycles(state => state.map(cycle => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
            } else {
                return cycle
            }
        }))
    }

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);

    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">

                <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setAmountSecondsPassed }}>
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
                </CyclesContext.Provider>

                {activeCycle ? (
                    <StopCountdownButton
                        onClick={handleInterruptCycle}
                        type="button"
                    >
                        <Hand size={15} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton
                        type="submit"
                        disabled={isSubmitDisabled}
                    >
                        <Play size={15} />
                        Comerçar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}
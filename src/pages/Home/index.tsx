import { Hand, Play } from "lucide-react";
import { useForm } from "react-hook-form";

import { CountdownContainer, HomeContainer, Separator, StartCountdownButton, StopCountdownButton } from "./styles";

import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns"
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

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

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0
        }
    });

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

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    useEffect(() => {
        let interval: number;
        if (activeCycle) {
            interval = setInterval(() => {
                const secondDifference = differenceInSeconds(new Date(), activeCycle.startDate);

                if (secondDifference >= totalSeconds) {
                    setCycles(state => state.map(cycle => {
                        if (cycle.id == activeCycleId) {
                            return { ...cycle, finishedDate: new Date() }
                        } else {
                            return cycle
                        }
                    }))
                    setAmountSecondsPassed(totalSeconds);
                    clearInterval(interval);
                } else {
                    setAmountSecondsPassed(secondDifference)
                }
            }, 1000)
        }

        // Função para resetar o que eu estava fazendo antes
        return () => {
            clearInterval(interval);
        }
    }, [activeCycle, totalSeconds, activeCycleId]);

    //Mudando o title da página com useEffect
    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle]);

    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">

                <NewCycleForm />
                <Countdown />

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
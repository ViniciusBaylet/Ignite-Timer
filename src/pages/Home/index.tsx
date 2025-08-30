import { Hand, Play } from "lucide-react";

import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";

import { createContext, useContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";
import { CyclesContext } from "../../contexts/CyclesContext";

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

export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle} = useContext(CyclesContext);

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0
        }
    });
    const { handleSubmit, watch, reset } = newCycleForm;

    const task = watch('task');
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(createNewCycle)} action="">

                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />


                {activeCycle ? (
                    <StopCountdownButton
                        onClick={interruptCurrentCycle}
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
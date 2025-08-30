import { useContext } from "react";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { CyclesContext } from "../..";
import { useFormContext } from "react-hook-form";


export function NewCycleForm() {

    const { activeCycle } = useContext(CyclesContext);
    //Esse useFormContext só funciona se tiver o FormProvider por volta do componente NewCycleForm na Home
    const { register } = useFormContext();

    return (
         <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        id="task"
                        placeholder="Dê um nome para o seu projeto" list="task-suggestions"
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="Projeto 4" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        min={1}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>
    )
}
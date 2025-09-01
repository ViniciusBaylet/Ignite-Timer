import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";

import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";


export function Countdown() {

    const { activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setAmountSecondsPassed } = useContext(CyclesContext);
   
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
    const minutesAmount = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    //Mudando o title da página com useEffect
    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle]);

    useEffect(() => {
        let interval: number;
        if (activeCycle) {
            interval = setInterval(() => {
                const secondDifference = differenceInSeconds(new Date(), new Date(activeCycle.startDate));

                if (secondDifference >= totalSeconds) {
                    markCurrentCycleAsFinished();
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
    }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setAmountSecondsPassed]);

    return (
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}
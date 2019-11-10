export function generateObjective(userLevel, forcedObjectiveType) {
    let objectiveType = 0;
    // Always advance the RNG the same number of time, whatever the objective
    let initialValue = RNG.getCurrentSeed();
    let firstValue = RNG.nextValue();
    let secondValue = RNG.nextValue();
    let difficultyThreshold = RNG.nextValueFloat();
    let goalQuantity = 1 + RNG.nextValue() % Math.min(24, (3 + 2 * Math.floor((userLevel || 0) / 6))); 
    let flavourTextId = RNG.nextValue() % ObjectiveFlavourText[objectiveType].length;

    let makerId = firstValue % 99999;
    let productId = secondValue % 99999;
    let categoryId = generateCategory(makerId);

    if (difficultyThreshold > 0.08 && userLevel > 1) {
        objectiveType = 1;

        if (difficultyThreshold > 0.30 && userLevel > 3) {
            objectiveType = 2;
        
            if (difficultyThreshold > 0.60 && userLevel > 5) {
                objectiveType = 3;

                if (difficultyThreshold > 0.90 && userLevel > 7) {
                    objectiveType = 4;
                }
            }
        }
    }

    if (forcedObjectiveType !== undefined) {
        objectiveType = forcedObjectiveType;
    }

    console.log(`[${userLevel}] ${difficultyThreshold} => ${objectiveType}`);

    let objective = {
        objectiveType,
        goalQuantity,
        flavourTextId,
        initialValue,
        categoryId,
        makerId,
        productId,
        submitted: [],
        completionTimestamp: null,
    };

    return objective;
}

export function generateObjectiveList(userLevel) {
    let generationTimestamp = Date.now();
    let initialValue = RNG.getCurrentSeed();
    let firstValue = RNG.getCurrentSeed();
    let objectiveCount = clamp(1, 1 + Math.floor(userLevel / 3), 4) + RNG.nextValue() % (1 + Math.min(6, 1 + Math.floor(userLevel / 2)));

    let objectives = [];

    if (userLevel === 2) {
        objectives.push(generateObjective(userLevel, 1));
    } else if (userLevel === 4) {
        objectives.push(generateObjective(userLevel, 2));
    } else if (userLevel === 6) {
        objectives.push(generateObjective(userLevel, 3));
    } else if (userLevel === 8) {
        objectives.push(generateObjective(userLevel, 4));
    }

    objectives = objectives.concat(
        Array(objectiveCount - objectives.length)
            .fill(0)
            .map(_ => generateObjective(userLevel))
    );

    let objectiveList = {
        generationTimestamp,
        completionTimestamp: null,
        initialValue,
        firstValue,
        objectives
    };

    return objectiveList;
}

export function isObjectiveCompleted(objective) {
    return (!!objective.completionTimestamp || (objective.goalQuantity <= objective.submitted.length));
}

export function isObjectiveListCompleted(objectiveList) {
    return (!!objectiveList.completionTimestamp || objectiveList.objectives.every(objective => isObjectiveCompleted(objective)));
}

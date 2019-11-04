export function generateObjective(userLevel, forcedObjectiveType) {
    let objectiveType = 0;
    // Always advance the RNG the same number of time, whatever the objective
    let initialValue = RNG.getCurrentSeed();
    let firstValue = RNG.nextValue();
    let secondValue = RNG.nextValue();
    let difficultyThreshold = RNG.nextValueFloat();
    let goalQuantity = RNG.nextValue() % Math.min(25, (3 + 2 * Math.floor((userLevel || 0) / 6))); 
    let flavourTextId = RNG.nextValue() % ObjectiveFlavourText[objectiveType].length;

    let categoryId = firstValue % Object.getOwnPropertyNames(ProductType).length;
    let makerId = firstValue % EntityCount.Maker;
    let productId = secondValue % EntityCount.ProductType[categoryId];

    if (difficultyThreshold > 0.08 && userLevel > 1) {
        objectiveType = 1;

        if (difficultyThreshold > 0.30 && userLevel > 3) {
            objectiveType = 2;
        
            if (difficultyThreshold > 0.60 && userLevel > 5) {
                objectiveType = 3;

                if (difficultyThreshold > 0.90 && userLevel > 9) {
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
        currentProgress: 0,
        goalQuantity,
        flavourTextId,
        initialValue,
        categoryId,
        makerId,
        productId,
    };

    return objective;
}


import React, {useMemo} from 'react';
import {ApiRelationInterface} from "../../api/models";
import {relationOptions, RelationValue} from "../../utils/enums";

function RelationsPerCategory({ relations }: { relations: ApiRelationInterface[] }) {
    const perCategory = useMemo(() => {
        const pc : Partial<{[key in RelationValue]: number}> = {};

        for (const relation of relations) {
            if (pc[relation.relation]) {
                // @ts-ignore
                pc[relation.relation] += 1;
            } else {
                pc[relation.relation] = 1
            }
        }
        return pc
    }, [relations]);

    return (
        <div>
            {Object.keys(perCategory).map((relationType) => {
                const type = relationType as RelationValue
                const option = relationOptions[type]
                const value = perCategory[type]
                return (
                    <div key={relationType} style={{ color: option.color }}>
                        {value}
                        &nbsp;
                        {option.label}
                    </div>
                )
            })}
        </div>
    );
}

export default RelationsPerCategory;

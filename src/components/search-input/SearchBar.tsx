import {useRef, useState} from "react";
import useGeneralSearch, { SearchType } from "./useGeneralSearch";
import {useTimeout} from "../../utils/hooks/useTimeout";
import styles from "./../layout/TopMenuBar.module.scss";
import Loader from "../loader/Loader";
import {Link} from "react-router-dom";
import NoResults from "../NoResults";
import * as React from "react";
import {ApiSearchInterface} from "../../api/models";
import {routes} from "../../utils/routes";
import {relationOptions, RelationValue} from "../../utils/enums";


function searchLink(item: ApiSearchInterface) {
    if (item.type === 'file') {
        return routes.editFile(item.object.id)
    } else if (item.type === 'relation') {
        const fbbs = item.object.file_bounding_blocks;
        if (fbbs?.length) {
            return routes.viewRelation(fbbs[0]?.file_id, item.object.id);
        }
    }
    return '';
}
function replaceRelationTag(context: string) {
    const regex = /\<relation\>([A-Z\_]+)<\/relation>/g;
    const found = context.match(regex);
    if (found && found.length > 0) {
        const relationString = found[0]
            .replace('<relation>', '')
            .replace('</relation>', '') as RelationValue;
        const relation = relationOptions[relationString];

        return context.replace(found[0], `<b style="color: ${relation.color}">${relation.label}</b>`)
    }
    return context
}

interface SearchBarProps {
    placeholder?: string,
    types: SearchType[],
    expands?: boolean
    autoFocus?: boolean
    onSelect?: ({ clearInput, item, input }: { clearInput: () => void, item: ApiSearchInterface, input?: HTMLInputElement }) => void
}

export default function SearchBar({ placeholder, types, onSelect, expands = true, autoFocus = false }: SearchBarProps) {
    const [focus, setFocus] = useState(false)
    const { value, onChange, results, isSearching, clear } = useGeneralSearch({ types });
    const { doTimeout } = useTimeout({ time: 200 });
    const inputRef = useRef<HTMLInputElement>()

    return (
        <div className={[styles.SearchBarContainer, focus ? styles.Focus : '', expands ? styles.Expands : styles.NotExpands].join(' ')}>
            <input
                autoFocus={autoFocus}
                className={styles.SearchBar}
                ref={(ref) => {
                    if (ref) {
                        inputRef.current = ref;
                    } else {
                        inputRef.current = undefined;
                    }
                }}
                placeholder={placeholder || 'Search files, relations or comments...'}
                value={value}
                onFocus={() => setFocus(true)}
                onBlur={() => doTimeout(() => setFocus(false))}
                onChange={(e) => {
                    e.persist()
                    setFocus(true);
                    onChange(e);
                }}
            />
            {focus && (
                <div className={styles.SearchBarResultsContainer}>
                    {isSearching && <Loader />}
                    <div className={styles.ResultsList}>
                        {!isSearching && Array.isArray(results) && results.length > 0 && results.map((item) => {
                            const content = (
                                <>
                                    <div className={styles.PreHeader}>
                                        <span className={styles.Type}>{item.type}</span>
                                        <span className={styles.Div} />
                                        <span className={styles.Id}>{item.object.id}</span>
                                    </div>
                                    <div className={styles.Title} dangerouslySetInnerHTML={{ __html: item.title }} />
                                    {item.context && (
                                        <span className={styles.Context} dangerouslySetInnerHTML={{__html: replaceRelationTag(item.context) }} />
                                    )}
                                </>
                            )
                            const link = searchLink(item);
                            return link && !onSelect ? (
                                <Link to={link} className={styles.ResultItem} key={item.object.id}>
                                    {content}
                                </Link>
                            ) : (
                                <a
                                    className={styles.ResultItem}
                                    key={item.object.id}
                                    onClick={onSelect
                                        ? () => onSelect({ clearInput: clear, item, input: inputRef.current })
                                        : undefined}
                                >
                                    {content}
                                </a>
                            );
                        })}
                    </div>
                    {!isSearching && Array.isArray(results) && results.length === 0 && (
                        <NoResults>No results found</NoResults>
                    )}
                </div>
            )}
        </div>
    );
}

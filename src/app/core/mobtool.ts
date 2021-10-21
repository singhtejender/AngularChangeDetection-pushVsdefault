import { Observable } from "rxjs";
import {
    reaction,
    computed,
    autorun,
    IReactionPublic,
    IReactionOptions,
    IReactionDisposer,
    Lambda,
    toJS,
} from "mobx";
import * as _ from "lodash";
import { IAutorunOptions } from "mobx/lib/api/autorun";
import { ChangeDetectorRef } from "@angular/core";
import { ldisposer } from "./lifestyles";

function initComponentDisposers(component: any): any {
    if (!component.__disposers) {
        component.__disposers = {};
    }

    return component;
}

function createAutorun(
    expression: Lambda,
    name?: string,
    component?: any
): IReactionDisposer {
    let options: IAutorunOptions | undefined;

    if (name) {
        options = {
            name: name + _.get(component, "constructor.name", ""),
        };
    }

    return autorun(expression, options);
}
export function addComponentDisposer(component: any, disposer: Lambda): void {
    if (!component.__mobx_unsubs) {
        component.__mobx_unsubs = [disposer];
    } else {
        component.__mobx_unsubs.push(disposer);
    }

    // bonus: flag the probe
}

export function addComponentDisposers(
    component: any,
    disposers: [string, Lambda][]
): void {
    initComponentDisposers(component);

    disposers.forEach(([name, disposer]) => {
        if (component.__disposers[name]) {
            component.__disposers[name]();
        }

        component.__disposers[name] = disposer;
    });
}

export function addComponentObservers(
    component: any,
    expressions: [string, Lambda][]
): void {
    addComponentDisposers(
        component,
        expressions.map(([name, expression]) => [
            name,
            createAutorun(expression, name, component),
        ]) as [string, Lambda][]
    );
}

export function fromStoreAsPromise<T>(expression: () => T): Observable<T> {
    const obs = new Observable<T>((observer) => {
        const computedValue = computed(expression);
        const disposer = computedValue.observe((changes) => {
            observer.next(changes.newValue);
        }, true);

        return () => disposer && disposer();
    });
    return obs;
}

let globalProbeIndex = 1;

export function setObserverProbe(name: string): () => void {
    const testability = window["_myPOC"];
    if (!testability) {
        return () => { };
    }

    const probes = testability.probes;
    if (!probes) {
        return () => { };
    }
    probes[name] = globalProbeIndex++;

    // ngOnDestroys usually delete these.
    return () => {
        delete probes[name];
    };
}

export function startObserver(
    expression: () => void,
    cdr: ChangeDetectorRef | null = null,
    name: string | null = null
): () => void {
    return startObservers(cdr, null, [[name, expression]]);
}

export function startObservers(
    cdr: ChangeDetectorRef | null,
    namePrefix: string | null,
    expressions: Array<[string | null, () => void]>
): () => void {
    const disposers: Array<() => void> = expressions.map((pair) => {
        const [name, expr] = pair;
        const wrapped = cdr ? andDetectChanges(cdr, expr) : expr;
        const opts = name
            ? {
                name: namePrefix ? namePrefix + name : name,
            }
            : {};
        const disposer = autorun(wrapped, opts);
        return disposer;
    });

    if (namePrefix) {
        disposers.push(setObserverProbe(namePrefix));
    }

    return () => disposers.forEach((d) => d());
}

// Deprecated, use startObservers instead
export function startObserving(component: any, expression: () => void): void;
export function startObserving(
    component: any,
    name: string,
    expression: () => void,
    skipAddDisposerToComponent?: boolean
): void;
export function startObserving(
    component: any,
    expressionOrName?: any,
    expression?: any
): void {
    let disposer: IReactionDisposer;

    if (typeof expressionOrName === "string") {
        disposer = autorun(expression, {
            name: expressionOrName + ":" + component.constructor.name,
        });
    } else {
        disposer = autorun(expressionOrName);
    }

    addComponentDisposer(component, disposer);
}

export function startReacting<T>(
    expression: (r: IReactionPublic) => T,
    effect: (arg: T, r: IReactionPublic) => void,
    opts?: IReactionOptions
): IReactionDisposer {
    return reaction(expression, effect, opts);
}

export function startReacters(
    namePrefix: string,
    reactors: Array<
        [
            name: string | "",
            expression: (r: IReactionPublic) => any,
            effect: (arg: any, r: IReactionPublic) => void,
            opts?: IReactionOptions
        ]
    >
): () => void {
    const disposers = reactors.map((r) => {
        const [name, exp, cb, opts] = r;
        // const wrapped = cdr ? andDetectChanges(cdr, cb) : cb;
        const options = Object.assign({}, opts, {
            name: namePrefix ? namePrefix + name : name,
        });
        return reaction(exp, cb, options);
    });
    return () => disposers.forEach((d) => d());
}

export function autoDisposer(component: any, expr: () => () => any): void {
    const disposer = expr();
    addComponentDisposer(component, disposer);
}

// create function that runs detectchanges after running the function
export function andDetectChanges(
    cdr: ChangeDetectorRef,
    expr: () => void
): () => void {
    function changeDetectWrapper(): void {
        expr();
        cdr.markForCheck();
    }
    return changeDetectWrapper;
}

export function logDump(...args: any[]): void {
    const l = args.map((a) => toJS(a));
    console.log(...l);
}

export function lautoruns(
    obj: Object,
    cdr: { markForCheck: () => void },
    namePrefix: string
): (name: string, fn: () => void) => void {
    const maker = function (name: string, fn: () => void): void {
        const wrapFn = function (): void {
            fn();
            cdr.markForCheck();
        };
        ldisposer(obj, autorun(wrapFn, { name: namePrefix + name }));
    };

    ldisposer(obj, setObserverProbe(namePrefix));
    return maker;
}

export function lwatchcomponent<T>(
    obj: { cdr: { markForCheck: Lambda } },
    stateComputedExpr: () => T
): void {
    ldisposer(
        obj,
        computed(stateComputedExpr).observe(() => {
            obj.cdr.markForCheck();
        })
    );
}

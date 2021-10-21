type Disposer = () => void;

const _disposers = new WeakMap<Object, Disposer[]>();

function addOrSet(obj: Object, disp: Disposer) {
    const ds = _disposers.get(obj);
    if (!ds) {
        _disposers.set(obj, [disp]);
    } else {
        ds.push(disp);
    }
}

export function lcancel<T extends { cancel: () => void }>(obj: Object, cancellable: T): T {
    ldisposer(obj, () => cancellable.cancel());
    return cancellable;
}

export function ldisposer(obj: Object, disp: Disposer) {
    addOrSet(obj, disp);
}

/**
 * Usually only needed when component can be lstopped before anyone adds disposers (e.g. asynchronous setup)
 */
export function lstart(obj: Object) {
    _disposers.set(obj, []);
}

let _ltrack_index = 1;
const _ltracked: any = {};

/**
 * Use only for debugging purposes. ltrack(this, "mycomponent") to track when it comes and goes, and follow counts
 */
export function ltrack(obj: Object, name: string) {
    const id = name + "-" + _ltrack_index++;
    const count = _ltracked[name] ?? 0;
    _ltracked[name] = count + 1;
    console.log("ltrack created:", id, "count:", _ltracked[name]);
    ldisposer(obj, () => {
        _ltracked[name] = _ltracked[name] - 1;
        console.log("ltrack stopped:", id, "count:", _ltracked[name]);
    });
}

/**
 * Run in ngOnDestroy. Runs all disposers
 */
export function lstop(obj: Object) {
    const ds = _disposers.get(obj);
    if (!ds) {
        throw new Error(
            "Illegal lifestyle, attempted to stop without disposers (add lstart if needed): " +
            obj
        );
    }
    for (const d of ds) {
        d();
    }
    _disposers.delete(obj);
}

export function lunsub<T extends { unsubscribe: () => void }>(
    obj: Object,
    ...obs: T[]
) {
    if (!obs || obs.length === 0) {
        throw new Error(
            "lunsub() no subscriptions, did you forget 'this' as first argument?"
        );
    }
    for (const o of obs) {
        addOrSet(obj, () => o.unsubscribe());
    }
    return obs;
}

export function ldelay(obj: Object, callback: () => void, delay?: number) {
    if (!delay) {
        delay = 0;
    }
    // we just wrap it here to make it easy to log / set breakpoints
    function delayedWork() {
        callback();
    }
    const ti = setTimeout(delayedWork, delay);
    ldisposer(obj, () => clearTimeout(ti));
}

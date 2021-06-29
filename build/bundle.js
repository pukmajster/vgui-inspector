
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /* node_modules\carbon-components-svelte\src\Button\ButtonSkeleton.svelte generated by Svelte v3.38.2 */

    const file$z = "node_modules\\carbon-components-svelte\\src\\Button\\ButtonSkeleton.svelte";

    // (38:0) {:else}
    function create_else_block$7(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[3]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === "field");
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === "small" || /*small*/ ctx[2]);
    			add_location(div, file$z, 38, 2, 799);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[8], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler_1*/ ctx[9], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler_1*/ ctx[10], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler_1*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === "field");
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === "small" || /*small*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(38:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if href}
    function create_if_block$n(ctx) {
    	let a;
    	let t_value = "" + "";
    	let t;
    	let a_rel_value;
    	let mounted;
    	let dispose;

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[3].target === "_blank"
    			? "noopener noreferrer"
    			: undefined
    		},
    		{ role: "button" },
    		/*$$restProps*/ ctx[3]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === "field");
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === "small" || /*small*/ ctx[2]);
    			add_location(a, file$z, 21, 2, 406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[5], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[6], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 8 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[3].target === "_blank"
    				? "noopener noreferrer"
    				: undefined) && { rel: a_rel_value },
    				{ role: "button" },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === "field");
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === "small" || /*small*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$n.name,
    		type: "if",
    		source: "(21:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[0]) return create_if_block$n;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","size","small"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ButtonSkeleton", slots, []);
    	let { href = undefined } = $$props;
    	let { size = "default" } = $$props;
    	let { small = false } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("size" in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ("small" in $$new_props) $$invalidate(2, small = $$new_props.small);
    	};

    	$$self.$capture_state = () => ({ href, size, small });

    	$$self.$inject_state = $$new_props => {
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("size" in $$props) $$invalidate(1, size = $$new_props.size);
    		if ("small" in $$props) $$invalidate(2, small = $$new_props.small);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		size,
    		small,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class ButtonSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { href: 0, size: 1, small: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonSkeleton",
    			options,
    			id: create_fragment$B.name
    		});
    	}

    	get href() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\Button\Button.svelte generated by Svelte v3.38.2 */
    const file$y = "node_modules\\carbon-components-svelte\\src\\Button\\Button.svelte";
    const get_default_slot_changes$3 = dirty => ({ props: dirty[0] & /*buttonProps*/ 512 });
    const get_default_slot_context$3 = ctx => ({ props: /*buttonProps*/ ctx[9] });

    // (153:0) {:else}
    function create_else_block$6(ctx) {
    	let button;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[0] && create_if_block_4$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	var switch_value = /*icon*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[4]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	let button_levels = [/*buttonProps*/ ctx[9]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			add_location(button, file$y, 153, 2, 3981);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (switch_instance) {
    				mount_component(switch_instance, button, null);
    			}

    			/*button_binding*/ ctx[32](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[23], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler_2*/ ctx[24], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler_2*/ ctx[25], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler_2*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$2(ctx);
    					if_block.c();
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 131072)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, null, null);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 16) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[4];

    			if (switch_value !== (switch_value = /*icon*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*button_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(153:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (133:28) 
    function create_if_block_2$4(ctx) {
    	let a;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[0] && create_if_block_3$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], null);
    	var switch_value = /*icon*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[4]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	let a_levels = [/*buttonProps*/ ctx[9]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(a, a_data);
    			add_location(a, file$y, 134, 2, 3598);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			if (switch_instance) {
    				mount_component(switch_instance, a, null);
    			}

    			/*a_binding*/ ctx[31](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler_1*/ ctx[19], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler_1*/ ctx[20], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler_1*/ ctx[21], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler_1*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$3(ctx);
    					if_block.c();
    					if_block.m(a, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 131072)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, null, null);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 16) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[4];

    			if (switch_value !== (switch_value = /*icon*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, a, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*a_binding*/ ctx[31](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(133:28) ",
    		ctx
    	});

    	return block;
    }

    // (131:13) 
    function create_if_block_1$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], get_default_slot_context$3);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, buttonProps*/ 131584)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[17], dirty, get_default_slot_changes$3, get_default_slot_context$3);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(131:13) ",
    		ctx
    	});

    	return block;
    }

    // (120:0) {#if skeleton}
    function create_if_block$m(ctx) {
    	let buttonskeleton;
    	let current;

    	const buttonskeleton_spread_levels = [
    		{ href: /*href*/ ctx[8] },
    		{ size: /*size*/ ctx[2] },
    		/*$$restProps*/ ctx[10],
    		{
    			style: /*hasIconOnly*/ ctx[0] && "width: 3rem;"
    		}
    	];

    	let buttonskeleton_props = {};

    	for (let i = 0; i < buttonskeleton_spread_levels.length; i += 1) {
    		buttonskeleton_props = assign(buttonskeleton_props, buttonskeleton_spread_levels[i]);
    	}

    	buttonskeleton = new ButtonSkeleton({
    			props: buttonskeleton_props,
    			$$inline: true
    		});

    	buttonskeleton.$on("click", /*click_handler*/ ctx[27]);
    	buttonskeleton.$on("mouseover", /*mouseover_handler*/ ctx[28]);
    	buttonskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[29]);
    	buttonskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[30]);

    	const block = {
    		c: function create() {
    			create_component(buttonskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buttonskeleton_changes = (dirty[0] & /*href, size, $$restProps, hasIconOnly*/ 1285)
    			? get_spread_update(buttonskeleton_spread_levels, [
    					dirty[0] & /*href*/ 256 && { href: /*href*/ ctx[8] },
    					dirty[0] & /*size*/ 4 && { size: /*size*/ ctx[2] },
    					dirty[0] & /*$$restProps*/ 1024 && get_spread_object(/*$$restProps*/ ctx[10]),
    					dirty[0] & /*hasIconOnly*/ 1 && {
    						style: /*hasIconOnly*/ ctx[0] && "width: 3rem;"
    					}
    				])
    			: {};

    			buttonskeleton.$set(buttonskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$m.name,
    		type: "if",
    		source: "(120:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    // (162:4) {#if hasIconOnly}
    function create_if_block_4$2(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[4]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$y, 162, 6, 4130);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 16) set_data_dev(t, /*iconDescription*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(162:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    // (143:4) {#if hasIconOnly}
    function create_if_block_3$3(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[4]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$y, 143, 6, 3742);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 16) set_data_dev(t, /*iconDescription*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(143:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$m, create_if_block_1$6, create_if_block_2$4, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[6]) return 0;
    		if (/*as*/ ctx[5]) return 1;
    		if (/*href*/ ctx[8] && !/*disabled*/ ctx[7]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let buttonProps;

    	const omit_props_names = [
    		"kind","size","isSelected","hasIconOnly","icon","iconDescription","tooltipAlignment","tooltipPosition","as","skeleton","disabled","href","tabindex","type","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { kind = "primary" } = $$props;
    	let { size = "default" } = $$props;
    	let { isSelected = false } = $$props;
    	let { hasIconOnly = false } = $$props;
    	let { icon = undefined } = $$props;
    	let { iconDescription = undefined } = $$props;
    	let { tooltipAlignment = "center" } = $$props;
    	let { tooltipPosition = "bottom" } = $$props;
    	let { as = false } = $$props;
    	let { skeleton = false } = $$props;
    	let { disabled = false } = $$props;
    	let { href = undefined } = $$props;
    	let { tabindex = "0" } = $$props;
    	let { type = "button" } = $$props;
    	let { ref = null } = $$props;
    	const ctx = getContext("ComposedModal");

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble($$self, event);
    	}

    	function click_handler_2(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_2(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_2(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_2(event) {
    		bubble($$self, event);
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("kind" in $$new_props) $$invalidate(11, kind = $$new_props.kind);
    		if ("size" in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ("isSelected" in $$new_props) $$invalidate(12, isSelected = $$new_props.isSelected);
    		if ("hasIconOnly" in $$new_props) $$invalidate(0, hasIconOnly = $$new_props.hasIconOnly);
    		if ("icon" in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ("iconDescription" in $$new_props) $$invalidate(4, iconDescription = $$new_props.iconDescription);
    		if ("tooltipAlignment" in $$new_props) $$invalidate(13, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ("tooltipPosition" in $$new_props) $$invalidate(14, tooltipPosition = $$new_props.tooltipPosition);
    		if ("as" in $$new_props) $$invalidate(5, as = $$new_props.as);
    		if ("skeleton" in $$new_props) $$invalidate(6, skeleton = $$new_props.skeleton);
    		if ("disabled" in $$new_props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ("href" in $$new_props) $$invalidate(8, href = $$new_props.href);
    		if ("tabindex" in $$new_props) $$invalidate(15, tabindex = $$new_props.tabindex);
    		if ("type" in $$new_props) $$invalidate(16, type = $$new_props.type);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		size,
    		isSelected,
    		hasIconOnly,
    		icon,
    		iconDescription,
    		tooltipAlignment,
    		tooltipPosition,
    		as,
    		skeleton,
    		disabled,
    		href,
    		tabindex,
    		type,
    		ref,
    		getContext,
    		ButtonSkeleton,
    		ctx,
    		buttonProps
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("kind" in $$props) $$invalidate(11, kind = $$new_props.kind);
    		if ("size" in $$props) $$invalidate(2, size = $$new_props.size);
    		if ("isSelected" in $$props) $$invalidate(12, isSelected = $$new_props.isSelected);
    		if ("hasIconOnly" in $$props) $$invalidate(0, hasIconOnly = $$new_props.hasIconOnly);
    		if ("icon" in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ("iconDescription" in $$props) $$invalidate(4, iconDescription = $$new_props.iconDescription);
    		if ("tooltipAlignment" in $$props) $$invalidate(13, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ("tooltipPosition" in $$props) $$invalidate(14, tooltipPosition = $$new_props.tooltipPosition);
    		if ("as" in $$props) $$invalidate(5, as = $$new_props.as);
    		if ("skeleton" in $$props) $$invalidate(6, skeleton = $$new_props.skeleton);
    		if ("disabled" in $$props) $$invalidate(7, disabled = $$new_props.disabled);
    		if ("href" in $$props) $$invalidate(8, href = $$new_props.href);
    		if ("tabindex" in $$props) $$invalidate(15, tabindex = $$new_props.tabindex);
    		if ("type" in $$props) $$invalidate(16, type = $$new_props.type);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ("buttonProps" in $$props) $$invalidate(9, buttonProps = $$new_props.buttonProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*ref*/ 2) {
    			if (ctx && ref) {
    				ctx.declareRef(ref);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*icon*/ 8) {
    			$$invalidate(0, hasIconOnly = icon && !$$slots.default);
    		}

    		$$invalidate(9, buttonProps = {
    			type: href && !disabled ? undefined : type,
    			tabindex,
    			disabled,
    			href,
    			"aria-pressed": hasIconOnly && kind === "ghost" ? isSelected : undefined,
    			...$$restProps,
    			class: [
    				"bx--btn",
    				size === "field" && "bx--btn--field",
    				size === "small" && "bx--btn--sm",
    				kind && `bx--btn--${kind}`,
    				disabled && "bx--btn--disabled",
    				hasIconOnly && "bx--btn--icon-only",
    				hasIconOnly && "bx--tooltip__trigger",
    				hasIconOnly && "bx--tooltip--a11y",
    				hasIconOnly && tooltipPosition && `bx--tooltip--${tooltipPosition}`,
    				hasIconOnly && tooltipAlignment && `bx--tooltip--align-${tooltipAlignment}`,
    				hasIconOnly && isSelected && kind === "ghost" && "bx--btn--selected",
    				$$restProps.class
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		hasIconOnly,
    		ref,
    		size,
    		icon,
    		iconDescription,
    		as,
    		skeleton,
    		disabled,
    		href,
    		buttonProps,
    		$$restProps,
    		kind,
    		isSelected,
    		tooltipAlignment,
    		tooltipPosition,
    		tabindex,
    		type,
    		$$scope,
    		slots,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		click_handler_2,
    		mouseover_handler_2,
    		mouseenter_handler_2,
    		mouseleave_handler_2,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$A,
    			create_fragment$A,
    			safe_not_equal,
    			{
    				kind: 11,
    				size: 2,
    				isSelected: 12,
    				hasIconOnly: 0,
    				icon: 3,
    				iconDescription: 4,
    				tooltipAlignment: 13,
    				tooltipPosition: 14,
    				as: 5,
    				skeleton: 6,
    				disabled: 7,
    				href: 8,
    				tabindex: 15,
    				type: 16,
    				ref: 1
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$A.name
    		});
    	}

    	get kind() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasIconOnly() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasIconOnly(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipAlignment() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipAlignment(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipPosition() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipPosition(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get as() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\Checkbox\CheckboxSkeleton.svelte generated by Svelte v3.38.2 */

    const file$x = "node_modules\\carbon-components-svelte\\src\\Checkbox\\CheckboxSkeleton.svelte";

    function create_fragment$z(ctx) {
    	let div;
    	let span;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[0]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			toggle_class(span, "bx--checkbox-label-text", true);
    			toggle_class(span, "bx--skeleton", true);
    			add_location(span, file$x, 10, 2, 191);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--form-item", true);
    			toggle_class(div, "bx--checkbox-wrapper", true);
    			toggle_class(div, "bx--checkbox-label", true);
    			add_location(div, file$x, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[2], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler*/ ctx[3], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    			toggle_class(div, "bx--form-item", true);
    			toggle_class(div, "bx--checkbox-wrapper", true);
    			toggle_class(div, "bx--checkbox-label", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CheckboxSkeleton", slots, []);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    	};

    	return [
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class CheckboxSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckboxSkeleton",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* node_modules\carbon-components-svelte\src\Checkbox\Checkbox.svelte generated by Svelte v3.38.2 */
    const file$w = "node_modules\\carbon-components-svelte\\src\\Checkbox\\Checkbox.svelte";

    // (58:0) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let span;
    	let t1;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[11]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			span = element("span");
    			t1 = text(/*labelText*/ ctx[6]);
    			attr_dev(input, "type", "checkbox");
    			input.checked = /*checked*/ ctx[0];
    			input.disabled = /*disabled*/ ctx[5];
    			attr_dev(input, "id", /*id*/ ctx[10]);
    			input.indeterminate = /*indeterminate*/ ctx[2];
    			attr_dev(input, "name", /*name*/ ctx[8]);
    			input.readOnly = /*readonly*/ ctx[4];
    			toggle_class(input, "bx--checkbox", true);
    			add_location(input, file$w, 67, 4, 1496);
    			toggle_class(span, "bx--checkbox-label-text", true);
    			toggle_class(span, "bx--visually-hidden", /*hideLabel*/ ctx[7]);
    			add_location(span, file$w, 83, 6, 1905);
    			attr_dev(label, "for", /*id*/ ctx[10]);
    			attr_dev(label, "title", /*title*/ ctx[9]);
    			toggle_class(label, "bx--checkbox-label", true);
    			add_location(label, file$w, 82, 4, 1830);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--form-item", true);
    			toggle_class(div, "bx--checkbox-wrapper", true);
    			add_location(div, file$w, 58, 2, 1323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			/*input_binding*/ ctx[21](input);
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, span);
    			append_dev(span, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[16], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[22], false, false, false),
    					listen_dev(div, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler_1*/ ctx[13], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler_1*/ ctx[14], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler_1*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*checked*/ 1) {
    				prop_dev(input, "checked", /*checked*/ ctx[0]);
    			}

    			if (dirty & /*disabled*/ 32) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[5]);
    			}

    			if (dirty & /*id*/ 1024) {
    				attr_dev(input, "id", /*id*/ ctx[10]);
    			}

    			if (dirty & /*indeterminate*/ 4) {
    				prop_dev(input, "indeterminate", /*indeterminate*/ ctx[2]);
    			}

    			if (dirty & /*name*/ 256) {
    				attr_dev(input, "name", /*name*/ ctx[8]);
    			}

    			if (dirty & /*readonly*/ 16) {
    				prop_dev(input, "readOnly", /*readonly*/ ctx[4]);
    			}

    			if (dirty & /*labelText*/ 64) set_data_dev(t1, /*labelText*/ ctx[6]);

    			if (dirty & /*hideLabel*/ 128) {
    				toggle_class(span, "bx--visually-hidden", /*hideLabel*/ ctx[7]);
    			}

    			if (dirty & /*id*/ 1024) {
    				attr_dev(label, "for", /*id*/ ctx[10]);
    			}

    			if (dirty & /*title*/ 512) {
    				attr_dev(label, "title", /*title*/ ctx[9]);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]]));
    			toggle_class(div, "bx--form-item", true);
    			toggle_class(div, "bx--checkbox-wrapper", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(58:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (50:0) {#if skeleton}
    function create_if_block$l(ctx) {
    	let checkboxskeleton;
    	let current;
    	const checkboxskeleton_spread_levels = [/*$$restProps*/ ctx[11]];
    	let checkboxskeleton_props = {};

    	for (let i = 0; i < checkboxskeleton_spread_levels.length; i += 1) {
    		checkboxskeleton_props = assign(checkboxskeleton_props, checkboxskeleton_spread_levels[i]);
    	}

    	checkboxskeleton = new CheckboxSkeleton({
    			props: checkboxskeleton_props,
    			$$inline: true
    		});

    	checkboxskeleton.$on("click", /*click_handler*/ ctx[17]);
    	checkboxskeleton.$on("mouseover", /*mouseover_handler*/ ctx[18]);
    	checkboxskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[19]);
    	checkboxskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[20]);

    	const block = {
    		c: function create() {
    			create_component(checkboxskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkboxskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkboxskeleton_changes = (dirty & /*$$restProps*/ 2048)
    			? get_spread_update(checkboxskeleton_spread_levels, [get_spread_object(/*$$restProps*/ ctx[11])])
    			: {};

    			checkboxskeleton.$set(checkboxskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkboxskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkboxskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkboxskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(50:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$l, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"checked","indeterminate","skeleton","readonly","disabled","labelText","hideLabel","name","title","id","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Checkbox", slots, []);
    	let { checked = false } = $$props;
    	let { indeterminate = false } = $$props;
    	let { skeleton = false } = $$props;
    	let { readonly = false } = $$props;
    	let { disabled = false } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { name = "" } = $$props;
    	let { title = undefined } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;
    	const dispatch = createEventDispatcher();

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const change_handler_1 = () => {
    		$$invalidate(0, checked = !checked);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("checked" in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ("indeterminate" in $$new_props) $$invalidate(2, indeterminate = $$new_props.indeterminate);
    		if ("skeleton" in $$new_props) $$invalidate(3, skeleton = $$new_props.skeleton);
    		if ("readonly" in $$new_props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("disabled" in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("labelText" in $$new_props) $$invalidate(6, labelText = $$new_props.labelText);
    		if ("hideLabel" in $$new_props) $$invalidate(7, hideLabel = $$new_props.hideLabel);
    		if ("name" in $$new_props) $$invalidate(8, name = $$new_props.name);
    		if ("title" in $$new_props) $$invalidate(9, title = $$new_props.title);
    		if ("id" in $$new_props) $$invalidate(10, id = $$new_props.id);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({
    		checked,
    		indeterminate,
    		skeleton,
    		readonly,
    		disabled,
    		labelText,
    		hideLabel,
    		name,
    		title,
    		id,
    		ref,
    		createEventDispatcher,
    		CheckboxSkeleton,
    		dispatch
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("checked" in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ("indeterminate" in $$props) $$invalidate(2, indeterminate = $$new_props.indeterminate);
    		if ("skeleton" in $$props) $$invalidate(3, skeleton = $$new_props.skeleton);
    		if ("readonly" in $$props) $$invalidate(4, readonly = $$new_props.readonly);
    		if ("disabled" in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ("labelText" in $$props) $$invalidate(6, labelText = $$new_props.labelText);
    		if ("hideLabel" in $$props) $$invalidate(7, hideLabel = $$new_props.hideLabel);
    		if ("name" in $$props) $$invalidate(8, name = $$new_props.name);
    		if ("title" in $$props) $$invalidate(9, title = $$new_props.title);
    		if ("id" in $$props) $$invalidate(10, id = $$new_props.id);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*checked*/ 1) {
    			dispatch("check", checked);
    		}
    	};

    	return [
    		checked,
    		ref,
    		indeterminate,
    		skeleton,
    		readonly,
    		disabled,
    		labelText,
    		hideLabel,
    		name,
    		title,
    		id,
    		$$restProps,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		change_handler,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		input_binding,
    		change_handler_1
    	];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {
    			checked: 0,
    			indeterminate: 2,
    			skeleton: 3,
    			readonly: 4,
    			disabled: 5,
    			labelText: 6,
    			hideLabel: 7,
    			name: 8,
    			title: 9,
    			id: 10,
    			ref: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get checked() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-icons-svelte\lib\WarningFilled16\WarningFilled16.svelte generated by Svelte v3.38.2 */

    const file$v = "node_modules\\carbon-icons-svelte\\lib\\WarningFilled16\\WarningFilled16.svelte";

    // (39:4) {#if title}
    function create_if_block$k(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$v, 39, 6, 1352);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block$8(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$k(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$k(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$8.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$8(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "WarningFilled16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 16 16" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path0, "d", "M8,1C4.2,1,1,4.2,1,8s3.2,7,7,7s7-3.1,7-7S11.9,1,8,1z M7.5,4h1v5h-1C7.5,9,7.5,4,7.5,4z M8,12.2\tc-0.4,0-0.8-0.4-0.8-0.8s0.3-0.8,0.8-0.8c0.4,0,0.8,0.4,0.8,0.8S8.4,12.2,8,12.2z");
    			add_location(path0, file$v, 36, 2, 953);
    			attr_dev(path1, "d", "M7.5,4h1v5h-1C7.5,9,7.5,4,7.5,4z M8,12.2c-0.4,0-0.8-0.4-0.8-0.8s0.3-0.8,0.8-0.8\tc0.4,0,0.8,0.4,0.8,0.8S8.4,12.2,8,12.2z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$v, 36, 192, 1143);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$v, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "WarningFilled16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 16 16" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WarningFilled16", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class WarningFilled16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningFilled16",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get class() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<WarningFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<WarningFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-icons-svelte\lib\WarningAltFilled16\WarningAltFilled16.svelte generated by Svelte v3.38.2 */

    const file$u = "node_modules\\carbon-icons-svelte\\lib\\WarningAltFilled16\\WarningAltFilled16.svelte";

    // (39:4) {#if title}
    function create_if_block$j(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$u, 39, 6, 1275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block$7(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$j(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$j(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$7.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$7(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "WarningAltFilled16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M14.875,11h2.25V21h-2.25ZM16,27a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,27Z");
    			add_location(path0, file$u, 36, 2, 956);
    			attr_dev(path1, "d", "M29.8872,28.5386l-13-25a1,1,0,0,0-1.7744,0l-13,25A1,1,0,0,0,3,30H29a1,1,0,0,0,.8872-1.4614ZM14.875,11h2.25V21h-2.25ZM16,27a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,27Z");
    			add_location(path1, file$u, 36, 106, 1060);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$u, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "WarningAltFilled16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("WarningAltFilled16", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class WarningAltFilled16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningAltFilled16",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get class() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<WarningAltFilled16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<WarningAltFilled16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-icons-svelte\lib\ChevronDown16\ChevronDown16.svelte generated by Svelte v3.38.2 */

    const file$t = "node_modules\\carbon-icons-svelte\\lib\\ChevronDown16\\ChevronDown16.svelte";

    // (39:4) {#if title}
    function create_if_block$i(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$t, 39, 6, 1039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block$6(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$i(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$6.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$6(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "ChevronDown16" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 16 16" },
    		{ fill: "currentColor" },
    		{ width: "16" },
    		{ height: "16" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z");
    			add_location(path, file$t, 36, 2, 951);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$t, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "ChevronDown16" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 16 16" },
    				{ fill: "currentColor" },
    				{ width: "16" },
    				{ height: "16" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChevronDown16", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class ChevronDown16 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronDown16",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get class() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<ChevronDown16>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<ChevronDown16>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-icons-svelte\lib\Close20\Close20.svelte generated by Svelte v3.38.2 */

    const file$s = "node_modules\\carbon-icons-svelte\\lib\\Close20\\Close20.svelte";

    // (39:4) {#if title}
    function create_if_block$h(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$s, 39, 6, 1091);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block$5(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$h(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$h(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$5.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$5(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "Close20" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ width: "20" },
    		{ height: "20" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$s, 36, 2, 945);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$s, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "Close20" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ width: "20" },
    				{ height: "20" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Close20", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class Close20 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close20",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get class() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Close20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Close20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\Grid\Grid.svelte generated by Svelte v3.38.2 */

    const file$r = "node_modules\\carbon-components-svelte\\src\\Grid\\Grid.svelte";
    const get_default_slot_changes$2 = dirty => ({ props: dirty & /*props*/ 2 });
    const get_default_slot_context$2 = ctx => ({ props: /*props*/ ctx[1] });

    // (54:0) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let div_levels = [/*props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$r, 54, 2, 1398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 2 && /*props*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:0) {#if as}
    function create_if_block$g(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$2);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, props*/ 514)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$2, get_default_slot_context$2);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(52:0) {#if as}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$g, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*as*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let props;

    	const omit_props_names = [
    		"as","condensed","narrow","fullWidth","noGutter","noGutterLeft","noGutterRight","padding"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Grid", slots, ['default']);
    	let { as = false } = $$props;
    	let { condensed = false } = $$props;
    	let { narrow = false } = $$props;
    	let { fullWidth = false } = $$props;
    	let { noGutter = false } = $$props;
    	let { noGutterLeft = false } = $$props;
    	let { noGutterRight = false } = $$props;
    	let { padding = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("as" in $$new_props) $$invalidate(0, as = $$new_props.as);
    		if ("condensed" in $$new_props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ("narrow" in $$new_props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ("fullWidth" in $$new_props) $$invalidate(4, fullWidth = $$new_props.fullWidth);
    		if ("noGutter" in $$new_props) $$invalidate(5, noGutter = $$new_props.noGutter);
    		if ("noGutterLeft" in $$new_props) $$invalidate(6, noGutterLeft = $$new_props.noGutterLeft);
    		if ("noGutterRight" in $$new_props) $$invalidate(7, noGutterRight = $$new_props.noGutterRight);
    		if ("padding" in $$new_props) $$invalidate(8, padding = $$new_props.padding);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		as,
    		condensed,
    		narrow,
    		fullWidth,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("as" in $$props) $$invalidate(0, as = $$new_props.as);
    		if ("condensed" in $$props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ("narrow" in $$props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ("fullWidth" in $$props) $$invalidate(4, fullWidth = $$new_props.fullWidth);
    		if ("noGutter" in $$props) $$invalidate(5, noGutter = $$new_props.noGutter);
    		if ("noGutterLeft" in $$props) $$invalidate(6, noGutterLeft = $$new_props.noGutterLeft);
    		if ("noGutterRight" in $$props) $$invalidate(7, noGutterRight = $$new_props.noGutterRight);
    		if ("padding" in $$props) $$invalidate(8, padding = $$new_props.padding);
    		if ("props" in $$props) $$invalidate(1, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(1, props = {
    			...$$restProps,
    			class: [
    				$$restProps.class,
    				"bx--grid",
    				condensed && "bx--grid--condensed",
    				narrow && "bx--grid--narrow",
    				fullWidth && "bx--grid--full-width",
    				noGutter && "bx--no-gutter",
    				noGutterLeft && "bx--no-gutter--left",
    				noGutterRight && "bx--no-gutter--right",
    				padding && "bx--row-padding"
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		as,
    		props,
    		condensed,
    		narrow,
    		fullWidth,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		$$scope,
    		slots
    	];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			as: 0,
    			condensed: 2,
    			narrow: 3,
    			fullWidth: 4,
    			noGutter: 5,
    			noGutterLeft: 6,
    			noGutterRight: 7,
    			padding: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get as() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get condensed() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set condensed(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get narrow() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set narrow(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullWidth() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullWidth(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutter() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutter(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterLeft() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterLeft(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterRight() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterRight(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\Grid\Row.svelte generated by Svelte v3.38.2 */

    const file$q = "node_modules\\carbon-components-svelte\\src\\Grid\\Row.svelte";
    const get_default_slot_changes$1 = dirty => ({ props: dirty & /*props*/ 2 });
    const get_default_slot_context$1 = ctx => ({ props: /*props*/ ctx[1] });

    // (50:0) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let div_levels = [/*props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$q, 50, 2, 1267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 2 && /*props*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(50:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:0) {#if as}
    function create_if_block$f(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, props*/ 258)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, get_default_slot_changes$1, get_default_slot_context$1);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(48:0) {#if as}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$f, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*as*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let props;
    	const omit_props_names = ["as","condensed","narrow","noGutter","noGutterLeft","noGutterRight","padding"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Row", slots, ['default']);
    	let { as = false } = $$props;
    	let { condensed = false } = $$props;
    	let { narrow = false } = $$props;
    	let { noGutter = false } = $$props;
    	let { noGutterLeft = false } = $$props;
    	let { noGutterRight = false } = $$props;
    	let { padding = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("as" in $$new_props) $$invalidate(0, as = $$new_props.as);
    		if ("condensed" in $$new_props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ("narrow" in $$new_props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ("noGutter" in $$new_props) $$invalidate(4, noGutter = $$new_props.noGutter);
    		if ("noGutterLeft" in $$new_props) $$invalidate(5, noGutterLeft = $$new_props.noGutterLeft);
    		if ("noGutterRight" in $$new_props) $$invalidate(6, noGutterRight = $$new_props.noGutterRight);
    		if ("padding" in $$new_props) $$invalidate(7, padding = $$new_props.padding);
    		if ("$$scope" in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		as,
    		condensed,
    		narrow,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("as" in $$props) $$invalidate(0, as = $$new_props.as);
    		if ("condensed" in $$props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ("narrow" in $$props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ("noGutter" in $$props) $$invalidate(4, noGutter = $$new_props.noGutter);
    		if ("noGutterLeft" in $$props) $$invalidate(5, noGutterLeft = $$new_props.noGutterLeft);
    		if ("noGutterRight" in $$props) $$invalidate(6, noGutterRight = $$new_props.noGutterRight);
    		if ("padding" in $$props) $$invalidate(7, padding = $$new_props.padding);
    		if ("props" in $$props) $$invalidate(1, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(1, props = {
    			...$$restProps,
    			class: [
    				$$restProps.class,
    				"bx--row",
    				condensed && "bx--row--condensed",
    				narrow && "bx--row--narrow",
    				noGutter && "bx--no-gutter",
    				noGutterLeft && "bx--no-gutter--left",
    				noGutterRight && "bx--no-gutter--right",
    				padding && "bx--row-padding"
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		as,
    		props,
    		condensed,
    		narrow,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		$$scope,
    		slots
    	];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			as: 0,
    			condensed: 2,
    			narrow: 3,
    			noGutter: 4,
    			noGutterLeft: 5,
    			noGutterRight: 6,
    			padding: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get as() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get condensed() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set condensed(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get narrow() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set narrow(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutter() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutter(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterLeft() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterLeft(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterRight() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterRight(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\Grid\Column.svelte generated by Svelte v3.38.2 */

    const file$p = "node_modules\\carbon-components-svelte\\src\\Grid\\Column.svelte";
    const get_default_slot_changes = dirty => ({ props: dirty & /*props*/ 2 });
    const get_default_slot_context = ctx => ({ props: /*props*/ ctx[1] });

    // (115:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	let div_levels = [/*props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$p, 115, 2, 2896);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 2 && /*props*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(115:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:0) {#if as}
    function create_if_block$e(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, props*/ 8194)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(113:0) {#if as}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$e, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*as*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let columnClass;
    	let props;

    	const omit_props_names = [
    		"as","noGutter","noGutterLeft","noGutterRight","padding","aspectRatio","sm","md","lg","xlg","max"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Column", slots, ['default']);
    	let { as = false } = $$props;
    	let { noGutter = false } = $$props;
    	let { noGutterLeft = false } = $$props;
    	let { noGutterRight = false } = $$props;
    	let { padding = false } = $$props;
    	let { aspectRatio = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xlg = undefined } = $$props;
    	let { max = undefined } = $$props;
    	const breakpoints = ["sm", "md", "lg", "xlg", "max"];

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("as" in $$new_props) $$invalidate(0, as = $$new_props.as);
    		if ("noGutter" in $$new_props) $$invalidate(2, noGutter = $$new_props.noGutter);
    		if ("noGutterLeft" in $$new_props) $$invalidate(3, noGutterLeft = $$new_props.noGutterLeft);
    		if ("noGutterRight" in $$new_props) $$invalidate(4, noGutterRight = $$new_props.noGutterRight);
    		if ("padding" in $$new_props) $$invalidate(5, padding = $$new_props.padding);
    		if ("aspectRatio" in $$new_props) $$invalidate(6, aspectRatio = $$new_props.aspectRatio);
    		if ("sm" in $$new_props) $$invalidate(7, sm = $$new_props.sm);
    		if ("md" in $$new_props) $$invalidate(8, md = $$new_props.md);
    		if ("lg" in $$new_props) $$invalidate(9, lg = $$new_props.lg);
    		if ("xlg" in $$new_props) $$invalidate(10, xlg = $$new_props.xlg);
    		if ("max" in $$new_props) $$invalidate(11, max = $$new_props.max);
    		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		as,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		aspectRatio,
    		sm,
    		md,
    		lg,
    		xlg,
    		max,
    		breakpoints,
    		columnClass,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("as" in $$props) $$invalidate(0, as = $$new_props.as);
    		if ("noGutter" in $$props) $$invalidate(2, noGutter = $$new_props.noGutter);
    		if ("noGutterLeft" in $$props) $$invalidate(3, noGutterLeft = $$new_props.noGutterLeft);
    		if ("noGutterRight" in $$props) $$invalidate(4, noGutterRight = $$new_props.noGutterRight);
    		if ("padding" in $$props) $$invalidate(5, padding = $$new_props.padding);
    		if ("aspectRatio" in $$props) $$invalidate(6, aspectRatio = $$new_props.aspectRatio);
    		if ("sm" in $$props) $$invalidate(7, sm = $$new_props.sm);
    		if ("md" in $$props) $$invalidate(8, md = $$new_props.md);
    		if ("lg" in $$props) $$invalidate(9, lg = $$new_props.lg);
    		if ("xlg" in $$props) $$invalidate(10, xlg = $$new_props.xlg);
    		if ("max" in $$props) $$invalidate(11, max = $$new_props.max);
    		if ("columnClass" in $$props) $$invalidate(12, columnClass = $$new_props.columnClass);
    		if ("props" in $$props) $$invalidate(1, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sm, md, lg, xlg, max*/ 3968) {
    			$$invalidate(12, columnClass = [sm, md, lg, xlg, max].map((breakpoint, i) => {
    				const name = breakpoints[i];

    				if (breakpoint === true) {
    					return `bx--col-${name}`;
    				} else if (typeof breakpoint === "number") {
    					return `bx--col-${name}-${breakpoint}`;
    				} else if (typeof breakpoint === "object") {
    					let bp = [];

    					if (typeof breakpoint.span === "number") {
    						bp = [...bp, `bx--col-${name}-${breakpoint.span}`];
    					} else if (breakpoint.span === true) {
    						bp = [...bp, `bx--col-${name}`];
    					}

    					if (typeof breakpoint.offset === "number") {
    						bp = [...bp, `bx--offset-${name}-${breakpoint.offset}`];
    					}

    					return bp.join(" ");
    				}
    			}).filter(Boolean).join(" "));
    		}

    		$$invalidate(1, props = {
    			...$$restProps,
    			class: [
    				$$restProps.class,
    				columnClass,
    				!columnClass && "bx--col",
    				noGutter && "bx--no-gutter",
    				noGutterLeft && "bx--no-gutter--left",
    				noGutterRight && "bx--no-gutter--right",
    				aspectRatio && `bx--aspect-ratio bx--aspect-ratio--${aspectRatio}`,
    				padding && "bx--col-padding"
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		as,
    		props,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		aspectRatio,
    		sm,
    		md,
    		lg,
    		xlg,
    		max,
    		columnClass,
    		$$scope,
    		slots
    	];
    }

    class Column extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			as: 0,
    			noGutter: 2,
    			noGutterLeft: 3,
    			noGutterRight: 4,
    			padding: 5,
    			aspectRatio: 6,
    			sm: 7,
    			md: 8,
    			lg: 9,
    			xlg: 10,
    			max: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Column",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get as() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutter() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutter(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterLeft() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterLeft(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterRight() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterRight(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aspectRatio() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aspectRatio(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xlg() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xlg(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\Icon\IconSkeleton.svelte generated by Svelte v3.38.2 */

    const file$o = "node_modules\\carbon-components-svelte\\src\\Icon\\IconSkeleton.svelte";

    function create_fragment$q(ctx) {
    	let div;
    	let div_style_value;
    	let mounted;
    	let dispose;

    	let div_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			style: div_style_value = "" + (/*$$restProps*/ ctx[1].style + "; width: " + /*size*/ ctx[0] + "px; height: " + /*size*/ ctx[0] + "px")
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--icon--skeleton", true);
    			add_location(div, file$o, 10, 0, 162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[3], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler*/ ctx[4], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				dirty & /*$$restProps, size*/ 3 && div_style_value !== (div_style_value = "" + (/*$$restProps*/ ctx[1].style + "; width: " + /*size*/ ctx[0] + "px; height: " + /*size*/ ctx[0] + "px")) && { style: div_style_value }
    			]));

    			toggle_class(div, "bx--icon--skeleton", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("IconSkeleton", slots, []);
    	let { size = 16 } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("size" in $$new_props) $$invalidate(0, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({ size });

    	$$self.$inject_state = $$new_props => {
    		if ("size" in $$props) $$invalidate(0, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class IconSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { size: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconSkeleton",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get size() {
    		throw new Error("<IconSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<IconSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\Icon\Icon.svelte generated by Svelte v3.38.2 */

    // (33:0) {:else}
    function create_else_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*$$restProps*/ ctx[2]];
    	var switch_value = /*render*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("click", /*click_handler_1*/ ctx[7]);
    		switch_instance.$on("mouseover", /*mouseover_handler_1*/ ctx[8]);
    		switch_instance.$on("mouseenter", /*mouseenter_handler_1*/ ctx[9]);
    		switch_instance.$on("mouseleave", /*mouseleave_handler_1*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*$$restProps*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*render*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("click", /*click_handler_1*/ ctx[7]);
    					switch_instance.$on("mouseover", /*mouseover_handler_1*/ ctx[8]);
    					switch_instance.$on("mouseenter", /*mouseenter_handler_1*/ ctx[9]);
    					switch_instance.$on("mouseleave", /*mouseleave_handler_1*/ ctx[10]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(33:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if skeleton}
    function create_if_block$d(ctx) {
    	let iconskeleton;
    	let current;
    	const iconskeleton_spread_levels = [/*$$restProps*/ ctx[2]];
    	let iconskeleton_props = {};

    	for (let i = 0; i < iconskeleton_spread_levels.length; i += 1) {
    		iconskeleton_props = assign(iconskeleton_props, iconskeleton_spread_levels[i]);
    	}

    	iconskeleton = new IconSkeleton({
    			props: iconskeleton_props,
    			$$inline: true
    		});

    	iconskeleton.$on("click", /*click_handler*/ ctx[3]);
    	iconskeleton.$on("mouseover", /*mouseover_handler*/ ctx[4]);
    	iconskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[5]);
    	iconskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(iconskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const iconskeleton_changes = (dirty & /*$$restProps*/ 4)
    			? get_spread_update(iconskeleton_spread_levels, [get_spread_object(/*$$restProps*/ ctx[2])])
    			: {};

    			iconskeleton.$set(iconskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(25:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	const omit_props_names = ["render","skeleton"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	let { render = undefined } = $$props;
    	let { skeleton = false } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("render" in $$new_props) $$invalidate(0, render = $$new_props.render);
    		if ("skeleton" in $$new_props) $$invalidate(1, skeleton = $$new_props.skeleton);
    	};

    	$$self.$capture_state = () => ({ render, skeleton, IconSkeleton });

    	$$self.$inject_state = $$new_props => {
    		if ("render" in $$props) $$invalidate(0, render = $$new_props.render);
    		if ("skeleton" in $$props) $$invalidate(1, skeleton = $$new_props.skeleton);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		render,
    		skeleton,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { render: 0, skeleton: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get render() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set render(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\Modal\Modal.svelte generated by Svelte v3.38.2 */
    const file$n = "node_modules\\carbon-components-svelte\\src\\Modal\\Modal.svelte";
    const get_heading_slot_changes = dirty => ({});
    const get_heading_slot_context = ctx => ({});
    const get_label_slot_changes = dirty => ({});
    const get_label_slot_context = ctx => ({});

    // (180:6) {#if passiveModal}
    function create_if_block_4$1(ctx) {
    	let button;
    	let close20;
    	let current;
    	let mounted;
    	let dispose;

    	close20 = new Close20({
    			props: {
    				"aria-label": /*iconDescription*/ ctx[7],
    				class: "bx--modal-close__icon"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(close20.$$.fragment);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", /*iconDescription*/ ctx[7]);
    			attr_dev(button, "title", /*iconDescription*/ ctx[7]);
    			toggle_class(button, "bx--modal-close", true);
    			add_location(button, file$n, 180, 8, 4650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(close20, button, null);
    			/*button_binding*/ ctx[35](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[36], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const close20_changes = {};
    			if (dirty[0] & /*iconDescription*/ 128) close20_changes["aria-label"] = /*iconDescription*/ ctx[7];
    			close20.$set(close20_changes);

    			if (!current || dirty[0] & /*iconDescription*/ 128) {
    				attr_dev(button, "aria-label", /*iconDescription*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*iconDescription*/ 128) {
    				attr_dev(button, "title", /*iconDescription*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close20.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close20.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(close20);
    			/*button_binding*/ ctx[35](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(180:6) {#if passiveModal}",
    		ctx
    	});

    	return block;
    }

    // (197:6) {#if modalLabel}
    function create_if_block_3$2(ctx) {
    	let h2;
    	let current;
    	const label_slot_template = /*#slots*/ ctx[29].label;
    	const label_slot = create_slot(label_slot_template, ctx, /*$$scope*/ ctx[47], get_label_slot_context);
    	const label_slot_or_fallback = label_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			if (label_slot_or_fallback) label_slot_or_fallback.c();
    			attr_dev(h2, "id", /*modalLabelId*/ ctx[21]);
    			toggle_class(h2, "bx--modal-header__label", true);
    			add_location(h2, file$n, 197, 8, 5091);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);

    			if (label_slot_or_fallback) {
    				label_slot_or_fallback.m(h2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (label_slot) {
    				if (label_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot(label_slot, label_slot_template, ctx, /*$$scope*/ ctx[47], dirty, get_label_slot_changes, get_label_slot_context);
    				}
    			} else {
    				if (label_slot_or_fallback && label_slot_or_fallback.p && dirty[0] & /*modalLabel*/ 64) {
    					label_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty[0] & /*modalLabelId*/ 2097152) {
    				attr_dev(h2, "id", /*modalLabelId*/ ctx[21]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (label_slot_or_fallback) label_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(197:6) {#if modalLabel}",
    		ctx
    	});

    	return block;
    }

    // (199:29) {modalLabel}
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*modalLabel*/ ctx[6]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*modalLabel*/ 64) set_data_dev(t, /*modalLabel*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(199:29) {modalLabel}",
    		ctx
    	});

    	return block;
    }

    // (203:29) {modalHeading}
    function fallback_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*modalHeading*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*modalHeading*/ 32) set_data_dev(t, /*modalHeading*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(203:29) {modalHeading}",
    		ctx
    	});

    	return block;
    }

    // (205:6) {#if !passiveModal}
    function create_if_block_2$3(ctx) {
    	let button;
    	let close20;
    	let current;
    	let mounted;
    	let dispose;

    	close20 = new Close20({
    			props: {
    				"aria-label": /*iconDescription*/ ctx[7],
    				class: "bx--modal-close__icon"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(close20.$$.fragment);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", /*iconDescription*/ ctx[7]);
    			attr_dev(button, "title", /*iconDescription*/ ctx[7]);
    			toggle_class(button, "bx--modal-close", true);
    			add_location(button, file$n, 205, 8, 5401);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(close20, button, null);
    			/*button_binding_1*/ ctx[37](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[38], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const close20_changes = {};
    			if (dirty[0] & /*iconDescription*/ 128) close20_changes["aria-label"] = /*iconDescription*/ ctx[7];
    			close20.$set(close20_changes);

    			if (!current || dirty[0] & /*iconDescription*/ 128) {
    				attr_dev(button, "aria-label", /*iconDescription*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*iconDescription*/ 128) {
    				attr_dev(button, "title", /*iconDescription*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close20.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close20.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(close20);
    			/*button_binding_1*/ ctx[37](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(205:6) {#if !passiveModal}",
    		ctx
    	});

    	return block;
    }

    // (235:4) {#if hasScrollingContent}
    function create_if_block_1$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			toggle_class(div, "bx--modal-content--overflow-indicator", true);
    			add_location(div, file$n, 235, 6, 6326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(235:4) {#if hasScrollingContent}",
    		ctx
    	});

    	return block;
    }

    // (238:4) {#if !passiveModal}
    function create_if_block$c(ctx) {
    	let div;
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				kind: "secondary",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler_3*/ ctx[39]);

    	button1 = new Button({
    			props: {
    				kind: /*danger*/ ctx[3] ? "danger" : "primary",
    				disabled: /*primaryButtonDisabled*/ ctx[11],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_4*/ ctx[40]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    			toggle_class(div, "bx--modal-footer", true);
    			add_location(div, file$n, 238, 6, 6431);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button0, div, null);
    			append_dev(div, t);
    			mount_component(button1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty[0] & /*secondaryButtonText*/ 8192 | dirty[1] & /*$$scope*/ 65536) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};
    			if (dirty[0] & /*danger*/ 8) button1_changes.kind = /*danger*/ ctx[3] ? "danger" : "primary";
    			if (dirty[0] & /*primaryButtonDisabled*/ 2048) button1_changes.disabled = /*primaryButtonDisabled*/ ctx[11];

    			if (dirty[0] & /*primaryButtonText*/ 1024 | dirty[1] & /*$$scope*/ 65536) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(238:4) {#if !passiveModal}",
    		ctx
    	});

    	return block;
    }

    // (240:8) <Button           kind="secondary"           on:click="{() => {             dispatch('click:button--secondary');           }}"         >
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*secondaryButtonText*/ ctx[13]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*secondaryButtonText*/ 8192) set_data_dev(t, /*secondaryButtonText*/ ctx[13]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(240:8) <Button           kind=\\\"secondary\\\"           on:click=\\\"{() => {             dispatch('click:button--secondary');           }}\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (248:8) <Button           kind="{danger ? 'danger' : 'primary'}"           disabled="{primaryButtonDisabled}"           on:click="{() => {             dispatch('submit');           }}"         >
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*primaryButtonText*/ ctx[10]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*primaryButtonText*/ 1024) set_data_dev(t, /*primaryButtonText*/ ctx[10]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(248:8) <Button           kind=\\\"{danger ? 'danger' : 'primary'}\\\"           disabled=\\\"{primaryButtonDisabled}\\\"           on:click=\\\"{() => {             dispatch('submit');           }}\\\"         >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let h3;
    	let t2;
    	let t3;
    	let div1;
    	let div1_tabindex_value;
    	let div1_role_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let t4;
    	let t5;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*passiveModal*/ ctx[4] && create_if_block_4$1(ctx);
    	let if_block1 = /*modalLabel*/ ctx[6] && create_if_block_3$2(ctx);
    	const heading_slot_template = /*#slots*/ ctx[29].heading;
    	const heading_slot = create_slot(heading_slot_template, ctx, /*$$scope*/ ctx[47], get_heading_slot_context);
    	const heading_slot_or_fallback = heading_slot || fallback_block$4(ctx);
    	let if_block2 = !/*passiveModal*/ ctx[4] && create_if_block_2$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[29].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[47], null);
    	let if_block3 = /*hasScrollingContent*/ ctx[9] && create_if_block_1$5(ctx);
    	let if_block4 = !/*passiveModal*/ ctx[4] && create_if_block$c(ctx);

    	let div2_levels = [
    		{ role: "dialog" },
    		{ tabindex: "-1" },
    		/*alertDialogProps*/ ctx[20],
    		{ "aria-modal": "true" },
    		{ "aria-label": /*ariaLabel*/ ctx[23] }
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	let div3_levels = [{ role: "presentation" }, { id: /*id*/ ctx[15] }, /*$$restProps*/ ctx[25]];
    	let div3_data = {};

    	for (let i = 0; i < div3_levels.length; i += 1) {
    		div3_data = assign(div3_data, div3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			h3 = element("h3");
    			if (heading_slot_or_fallback) heading_slot_or_fallback.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			attr_dev(h3, "id", /*modalHeadingId*/ ctx[22]);
    			toggle_class(h3, "bx--modal-header__heading", true);
    			add_location(h3, file$n, 201, 6, 5236);
    			toggle_class(div0, "bx--modal-header", true);
    			add_location(div0, file$n, 178, 4, 4579);
    			attr_dev(div1, "id", /*modalBodyId*/ ctx[16]);
    			attr_dev(div1, "tabindex", div1_tabindex_value = /*hasScrollingContent*/ ctx[9] ? "0" : undefined);
    			attr_dev(div1, "role", div1_role_value = /*hasScrollingContent*/ ctx[9] ? "region" : undefined);

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*hasScrollingContent*/ ctx[9]
    			? /*ariaLabel*/ ctx[23]
    			: undefined);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*modalLabel*/ ctx[6]
    			? /*modalLabelId*/ ctx[21]
    			: /*modalHeadingId*/ ctx[22]);

    			toggle_class(div1, "bx--modal-content", true);
    			toggle_class(div1, "bx--modal-content--with-form", /*hasForm*/ ctx[8]);
    			toggle_class(div1, "bx--modal-scroll-content", /*hasScrollingContent*/ ctx[9]);
    			add_location(div1, file$n, 222, 4, 5826);
    			set_attributes(div2, div2_data);
    			toggle_class(div2, "bx--modal-container", true);
    			toggle_class(div2, "bx--modal-container--xs", /*size*/ ctx[2] === "xs");
    			toggle_class(div2, "bx--modal-container--sm", /*size*/ ctx[2] === "sm");
    			toggle_class(div2, "bx--modal-container--lg", /*size*/ ctx[2] === "lg");
    			add_location(div2, file$n, 163, 2, 4165);
    			set_attributes(div3, div3_data);
    			toggle_class(div3, "bx--modal", true);
    			toggle_class(div3, "bx--modal-tall", !/*passiveModal*/ ctx[4]);
    			toggle_class(div3, "is-visible", /*open*/ ctx[0]);
    			toggle_class(div3, "bx--modal--danger", /*danger*/ ctx[3]);
    			add_location(div3, file$n, 130, 0, 3414);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, h3);

    			if (heading_slot_or_fallback) {
    				heading_slot_or_fallback.m(h3, null);
    			}

    			append_dev(div0, t2);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div2, t3);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div2, t4);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t5);
    			if (if_block4) if_block4.m(div2, null);
    			/*div2_binding*/ ctx[41](div2);
    			/*div3_binding*/ ctx[43](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler_5*/ ctx[42], false, false, false),
    					listen_dev(div3, "keydown", /*keydown_handler*/ ctx[30], false, false, false),
    					listen_dev(div3, "keydown", /*keydown_handler_1*/ ctx[44], false, false, false),
    					listen_dev(div3, "click", /*click_handler*/ ctx[31], false, false, false),
    					listen_dev(div3, "click", /*click_handler_6*/ ctx[45], false, false, false),
    					listen_dev(div3, "mouseover", /*mouseover_handler*/ ctx[32], false, false, false),
    					listen_dev(div3, "mouseenter", /*mouseenter_handler*/ ctx[33], false, false, false),
    					listen_dev(div3, "mouseleave", /*mouseleave_handler*/ ctx[34], false, false, false),
    					listen_dev(div3, "transitionend", /*transitionend_handler*/ ctx[46], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*passiveModal*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*passiveModal*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*modalLabel*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*modalLabel*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (heading_slot) {
    				if (heading_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot(heading_slot, heading_slot_template, ctx, /*$$scope*/ ctx[47], dirty, get_heading_slot_changes, get_heading_slot_context);
    				}
    			} else {
    				if (heading_slot_or_fallback && heading_slot_or_fallback.p && dirty[0] & /*modalHeading*/ 32) {
    					heading_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (!current || dirty[0] & /*modalHeadingId*/ 4194304) {
    				attr_dev(h3, "id", /*modalHeadingId*/ ctx[22]);
    			}

    			if (!/*passiveModal*/ ctx[4]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*passiveModal*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_2$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[47], dirty, null, null);
    				}
    			}

    			if (!current || dirty[0] & /*modalBodyId*/ 65536) {
    				attr_dev(div1, "id", /*modalBodyId*/ ctx[16]);
    			}

    			if (!current || dirty[0] & /*hasScrollingContent*/ 512 && div1_tabindex_value !== (div1_tabindex_value = /*hasScrollingContent*/ ctx[9] ? "0" : undefined)) {
    				attr_dev(div1, "tabindex", div1_tabindex_value);
    			}

    			if (!current || dirty[0] & /*hasScrollingContent*/ 512 && div1_role_value !== (div1_role_value = /*hasScrollingContent*/ ctx[9] ? "region" : undefined)) {
    				attr_dev(div1, "role", div1_role_value);
    			}

    			if (!current || dirty[0] & /*hasScrollingContent, ariaLabel*/ 8389120 && div1_aria_label_value !== (div1_aria_label_value = /*hasScrollingContent*/ ctx[9]
    			? /*ariaLabel*/ ctx[23]
    			: undefined)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*modalLabel, modalLabelId, modalHeadingId*/ 6291520 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*modalLabel*/ ctx[6]
    			? /*modalLabelId*/ ctx[21]
    			: /*modalHeadingId*/ ctx[22])) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (dirty[0] & /*hasForm*/ 256) {
    				toggle_class(div1, "bx--modal-content--with-form", /*hasForm*/ ctx[8]);
    			}

    			if (dirty[0] & /*hasScrollingContent*/ 512) {
    				toggle_class(div1, "bx--modal-scroll-content", /*hasScrollingContent*/ ctx[9]);
    			}

    			if (/*hasScrollingContent*/ ctx[9]) {
    				if (if_block3) ; else {
    					if_block3 = create_if_block_1$5(ctx);
    					if_block3.c();
    					if_block3.m(div2, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!/*passiveModal*/ ctx[4]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[0] & /*passiveModal*/ 16) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block$c(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div2, null);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				{ role: "dialog" },
    				{ tabindex: "-1" },
    				dirty[0] & /*alertDialogProps*/ 1048576 && /*alertDialogProps*/ ctx[20],
    				{ "aria-modal": "true" },
    				(!current || dirty[0] & /*ariaLabel*/ 8388608) && { "aria-label": /*ariaLabel*/ ctx[23] }
    			]));

    			toggle_class(div2, "bx--modal-container", true);
    			toggle_class(div2, "bx--modal-container--xs", /*size*/ ctx[2] === "xs");
    			toggle_class(div2, "bx--modal-container--sm", /*size*/ ctx[2] === "sm");
    			toggle_class(div2, "bx--modal-container--lg", /*size*/ ctx[2] === "lg");

    			set_attributes(div3, div3_data = get_spread_update(div3_levels, [
    				{ role: "presentation" },
    				(!current || dirty[0] & /*id*/ 32768) && { id: /*id*/ ctx[15] },
    				dirty[0] & /*$$restProps*/ 33554432 && /*$$restProps*/ ctx[25]
    			]));

    			toggle_class(div3, "bx--modal", true);
    			toggle_class(div3, "bx--modal-tall", !/*passiveModal*/ ctx[4]);
    			toggle_class(div3, "is-visible", /*open*/ ctx[0]);
    			toggle_class(div3, "bx--modal--danger", /*danger*/ ctx[3]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(heading_slot_or_fallback, local);
    			transition_in(if_block2);
    			transition_in(default_slot, local);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(heading_slot_or_fallback, local);
    			transition_out(if_block2);
    			transition_out(default_slot, local);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (heading_slot_or_fallback) heading_slot_or_fallback.d(detaching);
    			if (if_block2) if_block2.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			/*div2_binding*/ ctx[41](null);
    			/*div3_binding*/ ctx[43](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let modalLabelId;
    	let modalHeadingId;
    	let modalBodyId;
    	let ariaLabel;

    	const omit_props_names = [
    		"size","open","danger","alert","passiveModal","modalHeading","modalLabel","modalAriaLabel","iconDescription","hasForm","hasScrollingContent","primaryButtonText","primaryButtonDisabled","shouldSubmitOnEnter","secondaryButtonText","selectorPrimaryFocus","preventCloseOnClickOutside","id","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Modal", slots, ['label','heading','default']);
    	let { size = undefined } = $$props;
    	let { open = false } = $$props;
    	let { danger = false } = $$props;
    	let { alert = false } = $$props;
    	let { passiveModal = false } = $$props;
    	let { modalHeading = undefined } = $$props;
    	let { modalLabel = undefined } = $$props;
    	let { modalAriaLabel = undefined } = $$props;
    	let { iconDescription = "Close the modal" } = $$props;
    	let { hasForm = false } = $$props;
    	let { hasScrollingContent = false } = $$props;
    	let { primaryButtonText = "" } = $$props;
    	let { primaryButtonDisabled = false } = $$props;
    	let { shouldSubmitOnEnter = true } = $$props;
    	let { secondaryButtonText = "" } = $$props;
    	let { selectorPrimaryFocus = "[data-modal-primary-focus]" } = $$props;
    	let { preventCloseOnClickOutside = false } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let buttonRef = null;
    	let innerModal = null;
    	let opened = false;
    	let didClickInnerModal = false;

    	function focus(element) {
    		const node = (element || innerModal).querySelector(selectorPrimaryFocus) || buttonRef;
    		node.focus();
    	}

    	onMount(() => {
    		return () => {
    			document.body.classList.remove("bx--body--with-modal-open");
    		};
    	});

    	afterUpdate(() => {
    		if (opened) {
    			if (!open) {
    				opened = false;
    				dispatch("close");
    				document.body.classList.remove("bx--body--with-modal-open");
    			}
    		} else if (open) {
    			opened = true;
    			focus();
    			dispatch("open");
    			document.body.classList.add("bx--body--with-modal-open");
    		}
    	});

    	let alertDialogProps = {};

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			buttonRef = $$value;
    			$$invalidate(17, buttonRef);
    		});
    	}

    	const click_handler_1 = () => {
    		$$invalidate(0, open = false);
    	};

    	function button_binding_1($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			buttonRef = $$value;
    			$$invalidate(17, buttonRef);
    		});
    	}

    	const click_handler_2 = () => {
    		$$invalidate(0, open = false);
    	};

    	const click_handler_3 = () => {
    		dispatch("click:button--secondary");
    	};

    	const click_handler_4 = () => {
    		dispatch("submit");
    	};

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			innerModal = $$value;
    			$$invalidate(18, innerModal);
    		});
    	}

    	const click_handler_5 = () => {
    		$$invalidate(19, didClickInnerModal = true);
    	};

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const keydown_handler_1 = ({ key }) => {
    		if (open) {
    			if (key === "Escape") {
    				$$invalidate(0, open = false);
    			} else if (shouldSubmitOnEnter && key === "Enter") {
    				dispatch("submit");
    			}
    		}
    	};

    	const click_handler_6 = () => {
    		if (!didClickInnerModal && !preventCloseOnClickOutside) $$invalidate(0, open = false);
    		$$invalidate(19, didClickInnerModal = false);
    	};

    	const transitionend_handler = e => {
    		if (e.propertyName === "transform") {
    			dispatch("transitionend", { open });
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(50, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(25, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("size" in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ("open" in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ("danger" in $$new_props) $$invalidate(3, danger = $$new_props.danger);
    		if ("alert" in $$new_props) $$invalidate(26, alert = $$new_props.alert);
    		if ("passiveModal" in $$new_props) $$invalidate(4, passiveModal = $$new_props.passiveModal);
    		if ("modalHeading" in $$new_props) $$invalidate(5, modalHeading = $$new_props.modalHeading);
    		if ("modalLabel" in $$new_props) $$invalidate(6, modalLabel = $$new_props.modalLabel);
    		if ("modalAriaLabel" in $$new_props) $$invalidate(27, modalAriaLabel = $$new_props.modalAriaLabel);
    		if ("iconDescription" in $$new_props) $$invalidate(7, iconDescription = $$new_props.iconDescription);
    		if ("hasForm" in $$new_props) $$invalidate(8, hasForm = $$new_props.hasForm);
    		if ("hasScrollingContent" in $$new_props) $$invalidate(9, hasScrollingContent = $$new_props.hasScrollingContent);
    		if ("primaryButtonText" in $$new_props) $$invalidate(10, primaryButtonText = $$new_props.primaryButtonText);
    		if ("primaryButtonDisabled" in $$new_props) $$invalidate(11, primaryButtonDisabled = $$new_props.primaryButtonDisabled);
    		if ("shouldSubmitOnEnter" in $$new_props) $$invalidate(12, shouldSubmitOnEnter = $$new_props.shouldSubmitOnEnter);
    		if ("secondaryButtonText" in $$new_props) $$invalidate(13, secondaryButtonText = $$new_props.secondaryButtonText);
    		if ("selectorPrimaryFocus" in $$new_props) $$invalidate(28, selectorPrimaryFocus = $$new_props.selectorPrimaryFocus);
    		if ("preventCloseOnClickOutside" in $$new_props) $$invalidate(14, preventCloseOnClickOutside = $$new_props.preventCloseOnClickOutside);
    		if ("id" in $$new_props) $$invalidate(15, id = $$new_props.id);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ("$$scope" in $$new_props) $$invalidate(47, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		open,
    		danger,
    		alert,
    		passiveModal,
    		modalHeading,
    		modalLabel,
    		modalAriaLabel,
    		iconDescription,
    		hasForm,
    		hasScrollingContent,
    		primaryButtonText,
    		primaryButtonDisabled,
    		shouldSubmitOnEnter,
    		secondaryButtonText,
    		selectorPrimaryFocus,
    		preventCloseOnClickOutside,
    		id,
    		ref,
    		createEventDispatcher,
    		onMount,
    		afterUpdate,
    		Close20,
    		Button,
    		dispatch,
    		buttonRef,
    		innerModal,
    		opened,
    		didClickInnerModal,
    		focus,
    		alertDialogProps,
    		modalLabelId,
    		modalHeadingId,
    		modalBodyId,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(50, $$props = assign(assign({}, $$props), $$new_props));
    		if ("size" in $$props) $$invalidate(2, size = $$new_props.size);
    		if ("open" in $$props) $$invalidate(0, open = $$new_props.open);
    		if ("danger" in $$props) $$invalidate(3, danger = $$new_props.danger);
    		if ("alert" in $$props) $$invalidate(26, alert = $$new_props.alert);
    		if ("passiveModal" in $$props) $$invalidate(4, passiveModal = $$new_props.passiveModal);
    		if ("modalHeading" in $$props) $$invalidate(5, modalHeading = $$new_props.modalHeading);
    		if ("modalLabel" in $$props) $$invalidate(6, modalLabel = $$new_props.modalLabel);
    		if ("modalAriaLabel" in $$props) $$invalidate(27, modalAriaLabel = $$new_props.modalAriaLabel);
    		if ("iconDescription" in $$props) $$invalidate(7, iconDescription = $$new_props.iconDescription);
    		if ("hasForm" in $$props) $$invalidate(8, hasForm = $$new_props.hasForm);
    		if ("hasScrollingContent" in $$props) $$invalidate(9, hasScrollingContent = $$new_props.hasScrollingContent);
    		if ("primaryButtonText" in $$props) $$invalidate(10, primaryButtonText = $$new_props.primaryButtonText);
    		if ("primaryButtonDisabled" in $$props) $$invalidate(11, primaryButtonDisabled = $$new_props.primaryButtonDisabled);
    		if ("shouldSubmitOnEnter" in $$props) $$invalidate(12, shouldSubmitOnEnter = $$new_props.shouldSubmitOnEnter);
    		if ("secondaryButtonText" in $$props) $$invalidate(13, secondaryButtonText = $$new_props.secondaryButtonText);
    		if ("selectorPrimaryFocus" in $$props) $$invalidate(28, selectorPrimaryFocus = $$new_props.selectorPrimaryFocus);
    		if ("preventCloseOnClickOutside" in $$props) $$invalidate(14, preventCloseOnClickOutside = $$new_props.preventCloseOnClickOutside);
    		if ("id" in $$props) $$invalidate(15, id = $$new_props.id);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ("buttonRef" in $$props) $$invalidate(17, buttonRef = $$new_props.buttonRef);
    		if ("innerModal" in $$props) $$invalidate(18, innerModal = $$new_props.innerModal);
    		if ("opened" in $$props) opened = $$new_props.opened;
    		if ("didClickInnerModal" in $$props) $$invalidate(19, didClickInnerModal = $$new_props.didClickInnerModal);
    		if ("alertDialogProps" in $$props) $$invalidate(20, alertDialogProps = $$new_props.alertDialogProps);
    		if ("modalLabelId" in $$props) $$invalidate(21, modalLabelId = $$new_props.modalLabelId);
    		if ("modalHeadingId" in $$props) $$invalidate(22, modalHeadingId = $$new_props.modalHeadingId);
    		if ("modalBodyId" in $$props) $$invalidate(16, modalBodyId = $$new_props.modalBodyId);
    		if ("ariaLabel" in $$props) $$invalidate(23, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*id*/ 32768) {
    			$$invalidate(21, modalLabelId = `bx--modal-header__label--modal-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 32768) {
    			$$invalidate(22, modalHeadingId = `bx--modal-header__heading--modal-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 32768) {
    			$$invalidate(16, modalBodyId = `bx--modal-body--${id}`);
    		}

    		$$invalidate(23, ariaLabel = modalLabel || $$props["aria-label"] || modalAriaLabel || modalHeading);

    		if ($$self.$$.dirty[0] & /*alert, passiveModal, modalBodyId*/ 67174416) {
    			if (alert) {
    				if (passiveModal) {
    					$$invalidate(20, alertDialogProps.role = "alert", alertDialogProps);
    				}

    				if (!passiveModal) {
    					$$invalidate(20, alertDialogProps.role = "alertdialog", alertDialogProps);
    					$$invalidate(20, alertDialogProps["aria-describedby"] = modalBodyId, alertDialogProps);
    				}
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		open,
    		ref,
    		size,
    		danger,
    		passiveModal,
    		modalHeading,
    		modalLabel,
    		iconDescription,
    		hasForm,
    		hasScrollingContent,
    		primaryButtonText,
    		primaryButtonDisabled,
    		shouldSubmitOnEnter,
    		secondaryButtonText,
    		preventCloseOnClickOutside,
    		id,
    		modalBodyId,
    		buttonRef,
    		innerModal,
    		didClickInnerModal,
    		alertDialogProps,
    		modalLabelId,
    		modalHeadingId,
    		ariaLabel,
    		dispatch,
    		$$restProps,
    		alert,
    		modalAriaLabel,
    		selectorPrimaryFocus,
    		slots,
    		keydown_handler,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		button_binding,
    		click_handler_1,
    		button_binding_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		div2_binding,
    		click_handler_5,
    		div3_binding,
    		keydown_handler_1,
    		click_handler_6,
    		transitionend_handler,
    		$$scope
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$o,
    			create_fragment$o,
    			safe_not_equal,
    			{
    				size: 2,
    				open: 0,
    				danger: 3,
    				alert: 26,
    				passiveModal: 4,
    				modalHeading: 5,
    				modalLabel: 6,
    				modalAriaLabel: 27,
    				iconDescription: 7,
    				hasForm: 8,
    				hasScrollingContent: 9,
    				primaryButtonText: 10,
    				primaryButtonDisabled: 11,
    				shouldSubmitOnEnter: 12,
    				secondaryButtonText: 13,
    				selectorPrimaryFocus: 28,
    				preventCloseOnClickOutside: 14,
    				id: 15,
    				ref: 1
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get size() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get danger() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set danger(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alert() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alert(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get passiveModal() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set passiveModal(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalHeading() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalHeading(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get modalAriaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modalAriaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasForm() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasForm(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasScrollingContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasScrollingContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryButtonText() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryButtonText(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryButtonDisabled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryButtonDisabled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldSubmitOnEnter() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldSubmitOnEnter(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryButtonText() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryButtonText(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectorPrimaryFocus() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectorPrimaryFocus(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preventCloseOnClickOutside() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preventCloseOnClickOutside(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\TextArea\TextArea.svelte generated by Svelte v3.38.2 */
    const file$m = "node_modules\\carbon-components-svelte\\src\\TextArea\\TextArea.svelte";

    // (59:2) {#if labelText && !hideLabel}
    function create_if_block_3$1(ctx) {
    	let label;
    	let t;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t = text(/*labelText*/ ctx[8]);
    			attr_dev(label, "for", /*id*/ ctx[12]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[9]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			add_location(label, file$m, 59, 4, 1334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labelText*/ 256) set_data_dev(t, /*labelText*/ ctx[8]);

    			if (dirty & /*id*/ 4096) {
    				attr_dev(label, "for", /*id*/ ctx[12]);
    			}

    			if (dirty & /*hideLabel*/ 512) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[9]);
    			}

    			if (dirty & /*disabled*/ 64) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(59:2) {#if labelText && !hideLabel}",
    		ctx
    	});

    	return block;
    }

    // (73:4) {#if invalid}
    function create_if_block_2$2(ctx) {
    	let warningfilled16;
    	let current;

    	warningfilled16 = new WarningFilled16({
    			props: { class: "bx--text-area__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(73:4) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (99:2) {#if !invalid && helperText}
    function create_if_block_1$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[7]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			add_location(div, file$m, 99, 4, 2348);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*helperText*/ 128) set_data_dev(t, /*helperText*/ ctx[7]);

    			if (dirty & /*disabled*/ 64) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(99:2) {#if !invalid && helperText}",
    		ctx
    	});

    	return block;
    }

    // (107:2) {#if invalid}
    function create_if_block$b(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[11]);
    			attr_dev(div, "id", /*errorId*/ ctx[14]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$m, 107, 4, 2517);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*invalidText*/ 2048) set_data_dev(t, /*invalidText*/ ctx[11]);

    			if (dirty & /*errorId*/ 16384) {
    				attr_dev(div, "id", /*errorId*/ ctx[14]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(107:2) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let textarea;
    	let textarea_aria_invalid_value;
    	let textarea_aria_describedby_value;
    	let div0_data_invalid_value;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*labelText*/ ctx[8] && !/*hideLabel*/ ctx[9] && create_if_block_3$1(ctx);
    	let if_block1 = /*invalid*/ ctx[10] && create_if_block_2$2(ctx);

    	let textarea_levels = [
    		{
    			"aria-invalid": textarea_aria_invalid_value = /*invalid*/ ctx[10] || undefined
    		},
    		{
    			"aria-describedby": textarea_aria_describedby_value = /*invalid*/ ctx[10] ? /*errorId*/ ctx[14] : undefined
    		},
    		{ disabled: /*disabled*/ ctx[6] },
    		{ id: /*id*/ ctx[12] },
    		{ name: /*name*/ ctx[13] },
    		{ cols: /*cols*/ ctx[3] },
    		{ rows: /*rows*/ ctx[4] },
    		{ value: /*value*/ ctx[0] },
    		{ placeholder: /*placeholder*/ ctx[2] },
    		/*$$restProps*/ ctx[15]
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	let if_block2 = !/*invalid*/ ctx[10] && /*helperText*/ ctx[7] && create_if_block_1$4(ctx);
    	let if_block3 = /*invalid*/ ctx[10] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			textarea = element("textarea");
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			set_attributes(textarea, textarea_data);
    			toggle_class(textarea, "bx--text-area", true);
    			toggle_class(textarea, "bx--text-area--light", /*light*/ ctx[5]);
    			toggle_class(textarea, "bx--text-area--invalid", /*invalid*/ ctx[10]);
    			add_location(textarea, file$m, 75, 4, 1714);
    			attr_dev(div0, "data-invalid", div0_data_invalid_value = /*invalid*/ ctx[10] || undefined);
    			toggle_class(div0, "bx--text-area__wrapper", true);
    			add_location(div0, file$m, 68, 2, 1527);
    			toggle_class(div1, "bx--form-item", true);
    			add_location(div1, file$m, 51, 0, 1202);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, textarea);
    			/*textarea_binding*/ ctx[24](textarea);
    			append_dev(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block3) if_block3.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "change", /*change_handler*/ ctx[20], false, false, false),
    					listen_dev(textarea, "input", /*input_handler*/ ctx[21], false, false, false),
    					listen_dev(textarea, "input", /*input_handler_1*/ ctx[25], false, false, false),
    					listen_dev(textarea, "focus", /*focus_handler*/ ctx[22], false, false, false),
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[23], false, false, false),
    					listen_dev(div1, "click", /*click_handler*/ ctx[16], false, false, false),
    					listen_dev(div1, "mouseover", /*mouseover_handler*/ ctx[17], false, false, false),
    					listen_dev(div1, "mouseenter", /*mouseenter_handler*/ ctx[18], false, false, false),
    					listen_dev(div1, "mouseleave", /*mouseleave_handler*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*labelText*/ ctx[8] && !/*hideLabel*/ ctx[9]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*invalid*/ ctx[10]) {
    				if (if_block1) {
    					if (dirty & /*invalid*/ 1024) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				(!current || dirty & /*invalid*/ 1024 && textarea_aria_invalid_value !== (textarea_aria_invalid_value = /*invalid*/ ctx[10] || undefined)) && {
    					"aria-invalid": textarea_aria_invalid_value
    				},
    				(!current || dirty & /*invalid, errorId*/ 17408 && textarea_aria_describedby_value !== (textarea_aria_describedby_value = /*invalid*/ ctx[10] ? /*errorId*/ ctx[14] : undefined)) && {
    					"aria-describedby": textarea_aria_describedby_value
    				},
    				(!current || dirty & /*disabled*/ 64) && { disabled: /*disabled*/ ctx[6] },
    				(!current || dirty & /*id*/ 4096) && { id: /*id*/ ctx[12] },
    				(!current || dirty & /*name*/ 8192) && { name: /*name*/ ctx[13] },
    				(!current || dirty & /*cols*/ 8) && { cols: /*cols*/ ctx[3] },
    				(!current || dirty & /*rows*/ 16) && { rows: /*rows*/ ctx[4] },
    				(!current || dirty & /*value*/ 1) && { value: /*value*/ ctx[0] },
    				(!current || dirty & /*placeholder*/ 4) && { placeholder: /*placeholder*/ ctx[2] },
    				dirty & /*$$restProps*/ 32768 && /*$$restProps*/ ctx[15]
    			]));

    			toggle_class(textarea, "bx--text-area", true);
    			toggle_class(textarea, "bx--text-area--light", /*light*/ ctx[5]);
    			toggle_class(textarea, "bx--text-area--invalid", /*invalid*/ ctx[10]);

    			if (!current || dirty & /*invalid*/ 1024 && div0_data_invalid_value !== (div0_data_invalid_value = /*invalid*/ ctx[10] || undefined)) {
    				attr_dev(div0, "data-invalid", div0_data_invalid_value);
    			}

    			if (!/*invalid*/ ctx[10] && /*helperText*/ ctx[7]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$4(ctx);
    					if_block2.c();
    					if_block2.m(div1, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*invalid*/ ctx[10]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$b(ctx);
    					if_block3.c();
    					if_block3.m(div1, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*textarea_binding*/ ctx[24](null);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let errorId;

    	const omit_props_names = [
    		"value","placeholder","cols","rows","light","disabled","helperText","labelText","hideLabel","invalid","invalidText","id","name","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TextArea", slots, []);
    	let { value = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { cols = 50 } = $$props;
    	let { rows = 4 } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { helperText = "" } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const input_handler_1 = ({ target }) => {
    		$$invalidate(0, value = target.value);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(15, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("value" in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ("placeholder" in $$new_props) $$invalidate(2, placeholder = $$new_props.placeholder);
    		if ("cols" in $$new_props) $$invalidate(3, cols = $$new_props.cols);
    		if ("rows" in $$new_props) $$invalidate(4, rows = $$new_props.rows);
    		if ("light" in $$new_props) $$invalidate(5, light = $$new_props.light);
    		if ("disabled" in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ("helperText" in $$new_props) $$invalidate(7, helperText = $$new_props.helperText);
    		if ("labelText" in $$new_props) $$invalidate(8, labelText = $$new_props.labelText);
    		if ("hideLabel" in $$new_props) $$invalidate(9, hideLabel = $$new_props.hideLabel);
    		if ("invalid" in $$new_props) $$invalidate(10, invalid = $$new_props.invalid);
    		if ("invalidText" in $$new_props) $$invalidate(11, invalidText = $$new_props.invalidText);
    		if ("id" in $$new_props) $$invalidate(12, id = $$new_props.id);
    		if ("name" in $$new_props) $$invalidate(13, name = $$new_props.name);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		placeholder,
    		cols,
    		rows,
    		light,
    		disabled,
    		helperText,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		id,
    		name,
    		ref,
    		WarningFilled16,
    		errorId
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("value" in $$props) $$invalidate(0, value = $$new_props.value);
    		if ("placeholder" in $$props) $$invalidate(2, placeholder = $$new_props.placeholder);
    		if ("cols" in $$props) $$invalidate(3, cols = $$new_props.cols);
    		if ("rows" in $$props) $$invalidate(4, rows = $$new_props.rows);
    		if ("light" in $$props) $$invalidate(5, light = $$new_props.light);
    		if ("disabled" in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ("helperText" in $$props) $$invalidate(7, helperText = $$new_props.helperText);
    		if ("labelText" in $$props) $$invalidate(8, labelText = $$new_props.labelText);
    		if ("hideLabel" in $$props) $$invalidate(9, hideLabel = $$new_props.hideLabel);
    		if ("invalid" in $$props) $$invalidate(10, invalid = $$new_props.invalid);
    		if ("invalidText" in $$props) $$invalidate(11, invalidText = $$new_props.invalidText);
    		if ("id" in $$props) $$invalidate(12, id = $$new_props.id);
    		if ("name" in $$props) $$invalidate(13, name = $$new_props.name);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ("errorId" in $$props) $$invalidate(14, errorId = $$new_props.errorId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*id*/ 4096) {
    			$$invalidate(14, errorId = `error-${id}`);
    		}
    	};

    	return [
    		value,
    		ref,
    		placeholder,
    		cols,
    		rows,
    		light,
    		disabled,
    		helperText,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		id,
    		name,
    		errorId,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		change_handler,
    		input_handler,
    		focus_handler,
    		blur_handler,
    		textarea_binding,
    		input_handler_1
    	];
    }

    class TextArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			value: 0,
    			placeholder: 2,
    			cols: 3,
    			rows: 4,
    			light: 5,
    			disabled: 6,
    			helperText: 7,
    			labelText: 8,
    			hideLabel: 9,
    			invalid: 10,
    			invalidText: 11,
    			id: 12,
    			name: 13,
    			ref: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextArea",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get value() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cols() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cols(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<TextArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<TextArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\TextInput\TextInput.svelte generated by Svelte v3.38.2 */
    const file$l = "node_modules\\carbon-components-svelte\\src\\TextInput\\TextInput.svelte";

    // (85:2) {#if inline}
    function create_if_block_9(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*labelText*/ ctx[10] && create_if_block_11(ctx);
    	let if_block1 = !/*isFluid*/ ctx[18] && /*helperText*/ ctx[7] && create_if_block_10(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "bx--text-input__label-helper-wrapper");
    			add_location(div, file$l, 85, 4, 2038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*labelText*/ ctx[10]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_11(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*isFluid*/ ctx[18] && /*helperText*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_10(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(85:2) {#if inline}",
    		ctx
    	});

    	return block;
    }

    // (87:6) {#if labelText}
    function create_if_block_11(ctx) {
    	let label;
    	let t;
    	let label_class_value;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t = text(/*labelText*/ ctx[10]);
    			attr_dev(label, "for", /*id*/ ctx[8]);
    			attr_dev(label, "class", label_class_value = /*inline*/ ctx[17] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			toggle_class(label, "bx--label--inline", /*inline*/ ctx[17]);
    			add_location(label, file$l, 87, 8, 2119);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 1024) set_data_dev(t, /*labelText*/ ctx[10]);

    			if (dirty[0] & /*id*/ 256) {
    				attr_dev(label, "for", /*id*/ ctx[8]);
    			}

    			if (dirty[0] & /*inline, size*/ 131076 && label_class_value !== (label_class_value = /*inline*/ ctx[17] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`)) {
    				attr_dev(label, "class", label_class_value);
    			}

    			if (dirty[0] & /*inline, size*/ 131076) {
    				toggle_class(label, "bx--label", true);
    			}

    			if (dirty[0] & /*inline, size, hideLabel*/ 133124) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			}

    			if (dirty[0] & /*inline, size, disabled*/ 131140) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty[0] & /*inline, size, inline*/ 131076) {
    				toggle_class(label, "bx--label--inline", /*inline*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(87:6) {#if labelText}",
    		ctx
    	});

    	return block;
    }

    // (99:6) {#if !isFluid && helperText}
    function create_if_block_10(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[7]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[17]);
    			add_location(div, file$l, 99, 8, 2499);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 128) set_data_dev(t, /*helperText*/ ctx[7]);

    			if (dirty[0] & /*disabled*/ 64) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty[0] & /*inline*/ 131072) {
    				toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(99:6) {#if !isFluid && helperText}",
    		ctx
    	});

    	return block;
    }

    // (110:2) {#if !inline && labelText}
    function create_if_block_8(ctx) {
    	let label;
    	let t;
    	let label_class_value;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t = text(/*labelText*/ ctx[10]);
    			attr_dev(label, "for", /*id*/ ctx[8]);
    			attr_dev(label, "class", label_class_value = /*inline*/ ctx[17] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			toggle_class(label, "bx--label--inline", /*inline*/ ctx[17]);
    			add_location(label, file$l, 110, 4, 2781);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 1024) set_data_dev(t, /*labelText*/ ctx[10]);

    			if (dirty[0] & /*id*/ 256) {
    				attr_dev(label, "for", /*id*/ ctx[8]);
    			}

    			if (dirty[0] & /*inline, size*/ 131076 && label_class_value !== (label_class_value = /*inline*/ ctx[17] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`)) {
    				attr_dev(label, "class", label_class_value);
    			}

    			if (dirty[0] & /*inline, size*/ 131076) {
    				toggle_class(label, "bx--label", true);
    			}

    			if (dirty[0] & /*inline, size, hideLabel*/ 133124) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[11]);
    			}

    			if (dirty[0] & /*inline, size, disabled*/ 131140) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty[0] & /*inline, size, inline*/ 131076) {
    				toggle_class(label, "bx--label--inline", /*inline*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(110:2) {#if !inline && labelText}",
    		ctx
    	});

    	return block;
    }

    // (132:6) {#if invalid}
    function create_if_block_7(ctx) {
    	let warningfilled16;
    	let current;

    	warningfilled16 = new WarningFilled16({
    			props: { class: "bx--text-input__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(132:6) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (135:6) {#if !invalid && warn}
    function create_if_block_6(ctx) {
    	let warningaltfilled16;
    	let current;

    	warningaltfilled16 = new WarningAltFilled16({
    			props: {
    				class: "bx--text-input__invalid-icon\n            bx--text-input__invalid-icon--warning"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningaltfilled16.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningaltfilled16, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningaltfilled16.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningaltfilled16.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningaltfilled16, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(135:6) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (169:6) {#if isFluid}
    function create_if_block_5(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			toggle_class(hr, "bx--text-input__divider", true);
    			add_location(hr, file$l, 169, 8, 4591);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(169:6) {#if isFluid}",
    		ctx
    	});

    	return block;
    }

    // (172:6) {#if isFluid && !inline && invalid}
    function create_if_block_4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[13]);
    			attr_dev(div, "id", /*errorId*/ ctx[19]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$l, 172, 8, 4699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 8192) set_data_dev(t, /*invalidText*/ ctx[13]);

    			if (dirty[0] & /*errorId*/ 524288) {
    				attr_dev(div, "id", /*errorId*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(172:6) {#if isFluid && !inline && invalid}",
    		ctx
    	});

    	return block;
    }

    // (177:6) {#if isFluid && !inline && warn}
    function create_if_block_3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[15]);
    			attr_dev(div, "id", /*warnId*/ ctx[20]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$l, 177, 8, 4854);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 32768) set_data_dev(t, /*warnText*/ ctx[15]);

    			if (dirty[0] & /*warnId*/ 1048576) {
    				attr_dev(div, "id", /*warnId*/ ctx[20]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(177:6) {#if isFluid && !inline && warn}",
    		ctx
    	});

    	return block;
    }

    // (181:4) {#if !invalid && !warn && !isFluid && !inline && helperText}
    function create_if_block_2$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[7]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[17]);
    			add_location(div, file$l, 181, 6, 5020);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 128) set_data_dev(t, /*helperText*/ ctx[7]);

    			if (dirty[0] & /*disabled*/ 64) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[6]);
    			}

    			if (dirty[0] & /*inline*/ 131072) {
    				toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[17]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(181:4) {#if !invalid && !warn && !isFluid && !inline && helperText}",
    		ctx
    	});

    	return block;
    }

    // (190:4) {#if !isFluid && invalid}
    function create_if_block_1$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[13]);
    			attr_dev(div, "id", /*errorId*/ ctx[19]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$l, 190, 6, 5272);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 8192) set_data_dev(t, /*invalidText*/ ctx[13]);

    			if (dirty[0] & /*errorId*/ 524288) {
    				attr_dev(div, "id", /*errorId*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(190:4) {#if !isFluid && invalid}",
    		ctx
    	});

    	return block;
    }

    // (195:4) {#if !isFluid && !invalid && warn}
    function create_if_block$a(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[15]);
    			attr_dev(div, "id", /*warnId*/ ctx[20]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$l, 195, 6, 5419);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 32768) set_data_dev(t, /*warnText*/ ctx[15]);

    			if (dirty[0] & /*warnId*/ 1048576) {
    				attr_dev(div, "id", /*warnId*/ ctx[20]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(195:4) {#if !isFluid && !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div2;
    	let t0;
    	let t1;
    	let div1;
    	let div0;
    	let t2;
    	let t3;
    	let input;
    	let input_data_invalid_value;
    	let input_aria_invalid_value;
    	let input_data_warn_value;
    	let input_aria_describedby_value;
    	let input_class_value;
    	let t4;
    	let t5;
    	let t6;
    	let div0_data_invalid_value;
    	let div0_data_warn_value;
    	let t7;
    	let t8;
    	let t9;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*inline*/ ctx[17] && create_if_block_9(ctx);
    	let if_block1 = !/*inline*/ ctx[17] && /*labelText*/ ctx[10] && create_if_block_8(ctx);
    	let if_block2 = /*invalid*/ ctx[12] && create_if_block_7(ctx);
    	let if_block3 = !/*invalid*/ ctx[12] && /*warn*/ ctx[14] && create_if_block_6(ctx);

    	let input_levels = [
    		{
    			"data-invalid": input_data_invalid_value = /*invalid*/ ctx[12] || undefined
    		},
    		{
    			"aria-invalid": input_aria_invalid_value = /*invalid*/ ctx[12] || undefined
    		},
    		{
    			"data-warn": input_data_warn_value = /*warn*/ ctx[14] || undefined
    		},
    		{
    			"aria-describedby": input_aria_describedby_value = /*invalid*/ ctx[12]
    			? /*errorId*/ ctx[19]
    			: /*warn*/ ctx[14] ? /*warnId*/ ctx[20] : undefined
    		},
    		{ disabled: /*disabled*/ ctx[6] },
    		{ id: /*id*/ ctx[8] },
    		{ name: /*name*/ ctx[9] },
    		{ placeholder: /*placeholder*/ ctx[4] },
    		{ type: /*type*/ ctx[3] },
    		{ value: /*value*/ ctx[0] },
    		{ required: /*required*/ ctx[16] },
    		/*$$restProps*/ ctx[21],
    		{
    			class: input_class_value = /*size*/ ctx[2] && `bx--text-input--${/*size*/ ctx[2]}`
    		}
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block4 = /*isFluid*/ ctx[18] && create_if_block_5(ctx);
    	let if_block5 = /*isFluid*/ ctx[18] && !/*inline*/ ctx[17] && /*invalid*/ ctx[12] && create_if_block_4(ctx);
    	let if_block6 = /*isFluid*/ ctx[18] && !/*inline*/ ctx[17] && /*warn*/ ctx[14] && create_if_block_3(ctx);
    	let if_block7 = !/*invalid*/ ctx[12] && !/*warn*/ ctx[14] && !/*isFluid*/ ctx[18] && !/*inline*/ ctx[17] && /*helperText*/ ctx[7] && create_if_block_2$1(ctx);
    	let if_block8 = !/*isFluid*/ ctx[18] && /*invalid*/ ctx[12] && create_if_block_1$3(ctx);
    	let if_block9 = !/*isFluid*/ ctx[18] && !/*invalid*/ ctx[12] && /*warn*/ ctx[14] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			if (if_block4) if_block4.c();
    			t5 = space();
    			if (if_block5) if_block5.c();
    			t6 = space();
    			if (if_block6) if_block6.c();
    			t7 = space();
    			if (if_block7) if_block7.c();
    			t8 = space();
    			if (if_block8) if_block8.c();
    			t9 = space();
    			if (if_block9) if_block9.c();
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[5]);
    			toggle_class(input, "bx--text-input--invalid", /*invalid*/ ctx[12]);
    			toggle_class(input, "bx--text-input--warn", /*warn*/ ctx[14]);
    			add_location(input, file$l, 140, 6, 3709);
    			attr_dev(div0, "data-invalid", div0_data_invalid_value = /*invalid*/ ctx[12] || undefined);
    			attr_dev(div0, "data-warn", div0_data_warn_value = /*warn*/ ctx[14] || undefined);
    			toggle_class(div0, "bx--text-input__field-wrapper", true);
    			toggle_class(div0, "bx--text-input__field-wrapper--warning", !/*invalid*/ ctx[12] && /*warn*/ ctx[14]);
    			add_location(div0, file$l, 125, 4, 3213);
    			toggle_class(div1, "bx--text-input__field-outer-wrapper", true);
    			toggle_class(div1, "bx--text-input__field-outer-wrapper--inline", /*inline*/ ctx[17]);
    			add_location(div1, file$l, 121, 2, 3080);
    			toggle_class(div2, "bx--form-item", true);
    			toggle_class(div2, "bx--text-input-wrapper", true);
    			toggle_class(div2, "bx--text-input-wrapper--inline", /*inline*/ ctx[17]);
    			add_location(div2, file$l, 75, 0, 1833);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t0);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t2);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div0, t3);
    			append_dev(div0, input);
    			input.value = input_data.value;
    			/*input_binding*/ ctx[31](input);
    			append_dev(div0, t4);
    			if (if_block4) if_block4.m(div0, null);
    			append_dev(div0, t5);
    			if (if_block5) if_block5.m(div0, null);
    			append_dev(div0, t6);
    			if (if_block6) if_block6.m(div0, null);
    			append_dev(div1, t7);
    			if (if_block7) if_block7.m(div1, null);
    			append_dev(div1, t8);
    			if (if_block8) if_block8.m(div1, null);
    			append_dev(div1, t9);
    			if (if_block9) if_block9.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[26], false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[27], false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[32], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[28], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[29], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[30], false, false, false),
    					listen_dev(div2, "click", /*click_handler*/ ctx[22], false, false, false),
    					listen_dev(div2, "mouseover", /*mouseover_handler*/ ctx[23], false, false, false),
    					listen_dev(div2, "mouseenter", /*mouseenter_handler*/ ctx[24], false, false, false),
    					listen_dev(div2, "mouseleave", /*mouseleave_handler*/ ctx[25], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*inline*/ ctx[17]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					if_block0.m(div2, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!/*inline*/ ctx[17] && /*labelText*/ ctx[10]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_8(ctx);
    					if_block1.c();
    					if_block1.m(div2, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*invalid*/ ctx[12]) {
    				if (if_block2) {
    					if (dirty[0] & /*invalid*/ 4096) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_7(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[12] && /*warn*/ ctx[14]) {
    				if (if_block3) {
    					if (dirty[0] & /*invalid, warn*/ 20480) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_6(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div0, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty[0] & /*invalid*/ 4096 && input_data_invalid_value !== (input_data_invalid_value = /*invalid*/ ctx[12] || undefined)) && { "data-invalid": input_data_invalid_value },
    				(!current || dirty[0] & /*invalid*/ 4096 && input_aria_invalid_value !== (input_aria_invalid_value = /*invalid*/ ctx[12] || undefined)) && { "aria-invalid": input_aria_invalid_value },
    				(!current || dirty[0] & /*warn*/ 16384 && input_data_warn_value !== (input_data_warn_value = /*warn*/ ctx[14] || undefined)) && { "data-warn": input_data_warn_value },
    				(!current || dirty[0] & /*invalid, errorId, warn, warnId*/ 1593344 && input_aria_describedby_value !== (input_aria_describedby_value = /*invalid*/ ctx[12]
    				? /*errorId*/ ctx[19]
    				: /*warn*/ ctx[14] ? /*warnId*/ ctx[20] : undefined)) && {
    					"aria-describedby": input_aria_describedby_value
    				},
    				(!current || dirty[0] & /*disabled*/ 64) && { disabled: /*disabled*/ ctx[6] },
    				(!current || dirty[0] & /*id*/ 256) && { id: /*id*/ ctx[8] },
    				(!current || dirty[0] & /*name*/ 512) && { name: /*name*/ ctx[9] },
    				(!current || dirty[0] & /*placeholder*/ 16) && { placeholder: /*placeholder*/ ctx[4] },
    				(!current || dirty[0] & /*type*/ 8) && { type: /*type*/ ctx[3] },
    				(!current || dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) && { value: /*value*/ ctx[0] },
    				(!current || dirty[0] & /*required*/ 65536) && { required: /*required*/ ctx[16] },
    				dirty[0] & /*$$restProps*/ 2097152 && /*$$restProps*/ ctx[21],
    				(!current || dirty[0] & /*size*/ 4 && input_class_value !== (input_class_value = /*size*/ ctx[2] && `bx--text-input--${/*size*/ ctx[2]}`)) && { class: input_class_value }
    			]));

    			if ("value" in input_data) {
    				input.value = input_data.value;
    			}

    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[5]);
    			toggle_class(input, "bx--text-input--invalid", /*invalid*/ ctx[12]);
    			toggle_class(input, "bx--text-input--warn", /*warn*/ ctx[14]);

    			if (/*isFluid*/ ctx[18]) {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_5(ctx);
    					if_block4.c();
    					if_block4.m(div0, t5);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*isFluid*/ ctx[18] && !/*inline*/ ctx[17] && /*invalid*/ ctx[12]) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_4(ctx);
    					if_block5.c();
    					if_block5.m(div0, t6);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*isFluid*/ ctx[18] && !/*inline*/ ctx[17] && /*warn*/ ctx[14]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_3(ctx);
    					if_block6.c();
    					if_block6.m(div0, null);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (!current || dirty[0] & /*invalid*/ 4096 && div0_data_invalid_value !== (div0_data_invalid_value = /*invalid*/ ctx[12] || undefined)) {
    				attr_dev(div0, "data-invalid", div0_data_invalid_value);
    			}

    			if (!current || dirty[0] & /*warn*/ 16384 && div0_data_warn_value !== (div0_data_warn_value = /*warn*/ ctx[14] || undefined)) {
    				attr_dev(div0, "data-warn", div0_data_warn_value);
    			}

    			if (dirty[0] & /*invalid, warn*/ 20480) {
    				toggle_class(div0, "bx--text-input__field-wrapper--warning", !/*invalid*/ ctx[12] && /*warn*/ ctx[14]);
    			}

    			if (!/*invalid*/ ctx[12] && !/*warn*/ ctx[14] && !/*isFluid*/ ctx[18] && !/*inline*/ ctx[17] && /*helperText*/ ctx[7]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_2$1(ctx);
    					if_block7.c();
    					if_block7.m(div1, t8);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (!/*isFluid*/ ctx[18] && /*invalid*/ ctx[12]) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_1$3(ctx);
    					if_block8.c();
    					if_block8.m(div1, t9);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (!/*isFluid*/ ctx[18] && !/*invalid*/ ctx[12] && /*warn*/ ctx[14]) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block$a(ctx);
    					if_block9.c();
    					if_block9.m(div1, null);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (dirty[0] & /*inline*/ 131072) {
    				toggle_class(div1, "bx--text-input__field-outer-wrapper--inline", /*inline*/ ctx[17]);
    			}

    			if (dirty[0] & /*inline*/ 131072) {
    				toggle_class(div2, "bx--text-input-wrapper--inline", /*inline*/ ctx[17]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			/*input_binding*/ ctx[31](null);
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let isFluid;
    	let errorId;
    	let warnId;

    	const omit_props_names = [
    		"size","value","type","placeholder","light","disabled","helperText","id","name","labelText","hideLabel","invalid","invalidText","warn","warnText","ref","required","inline"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TextInput", slots, []);
    	let { size = undefined } = $$props;
    	let { value = "" } = $$props;
    	let { type = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { helperText = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { ref = null } = $$props;
    	let { required = false } = $$props;
    	let { inline = false } = $$props;
    	const ctx = getContext("Form");

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const input_handler_1 = ({ target }) => {
    		$$invalidate(0, value = target.value);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(21, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("size" in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ("value" in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ("type" in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ("placeholder" in $$new_props) $$invalidate(4, placeholder = $$new_props.placeholder);
    		if ("light" in $$new_props) $$invalidate(5, light = $$new_props.light);
    		if ("disabled" in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ("helperText" in $$new_props) $$invalidate(7, helperText = $$new_props.helperText);
    		if ("id" in $$new_props) $$invalidate(8, id = $$new_props.id);
    		if ("name" in $$new_props) $$invalidate(9, name = $$new_props.name);
    		if ("labelText" in $$new_props) $$invalidate(10, labelText = $$new_props.labelText);
    		if ("hideLabel" in $$new_props) $$invalidate(11, hideLabel = $$new_props.hideLabel);
    		if ("invalid" in $$new_props) $$invalidate(12, invalid = $$new_props.invalid);
    		if ("invalidText" in $$new_props) $$invalidate(13, invalidText = $$new_props.invalidText);
    		if ("warn" in $$new_props) $$invalidate(14, warn = $$new_props.warn);
    		if ("warnText" in $$new_props) $$invalidate(15, warnText = $$new_props.warnText);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ("required" in $$new_props) $$invalidate(16, required = $$new_props.required);
    		if ("inline" in $$new_props) $$invalidate(17, inline = $$new_props.inline);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		value,
    		type,
    		placeholder,
    		light,
    		disabled,
    		helperText,
    		id,
    		name,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		ref,
    		required,
    		inline,
    		getContext,
    		WarningFilled16,
    		WarningAltFilled16,
    		ctx,
    		isFluid,
    		errorId,
    		warnId
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("size" in $$props) $$invalidate(2, size = $$new_props.size);
    		if ("value" in $$props) $$invalidate(0, value = $$new_props.value);
    		if ("type" in $$props) $$invalidate(3, type = $$new_props.type);
    		if ("placeholder" in $$props) $$invalidate(4, placeholder = $$new_props.placeholder);
    		if ("light" in $$props) $$invalidate(5, light = $$new_props.light);
    		if ("disabled" in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ("helperText" in $$props) $$invalidate(7, helperText = $$new_props.helperText);
    		if ("id" in $$props) $$invalidate(8, id = $$new_props.id);
    		if ("name" in $$props) $$invalidate(9, name = $$new_props.name);
    		if ("labelText" in $$props) $$invalidate(10, labelText = $$new_props.labelText);
    		if ("hideLabel" in $$props) $$invalidate(11, hideLabel = $$new_props.hideLabel);
    		if ("invalid" in $$props) $$invalidate(12, invalid = $$new_props.invalid);
    		if ("invalidText" in $$props) $$invalidate(13, invalidText = $$new_props.invalidText);
    		if ("warn" in $$props) $$invalidate(14, warn = $$new_props.warn);
    		if ("warnText" in $$props) $$invalidate(15, warnText = $$new_props.warnText);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ("required" in $$props) $$invalidate(16, required = $$new_props.required);
    		if ("inline" in $$props) $$invalidate(17, inline = $$new_props.inline);
    		if ("isFluid" in $$props) $$invalidate(18, isFluid = $$new_props.isFluid);
    		if ("errorId" in $$props) $$invalidate(19, errorId = $$new_props.errorId);
    		if ("warnId" in $$props) $$invalidate(20, warnId = $$new_props.warnId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*id*/ 256) {
    			$$invalidate(19, errorId = `error-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 256) {
    			$$invalidate(20, warnId = `warn-${id}`);
    		}
    	};

    	$$invalidate(18, isFluid = !!ctx && ctx.isFluid);

    	return [
    		value,
    		ref,
    		size,
    		type,
    		placeholder,
    		light,
    		disabled,
    		helperText,
    		id,
    		name,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		required,
    		inline,
    		isFluid,
    		errorId,
    		warnId,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		change_handler,
    		input_handler,
    		keydown_handler,
    		focus_handler,
    		blur_handler,
    		input_binding,
    		input_handler_1
    	];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$m,
    			create_fragment$m,
    			safe_not_equal,
    			{
    				size: 2,
    				value: 0,
    				type: 3,
    				placeholder: 4,
    				light: 5,
    				disabled: 6,
    				helperText: 7,
    				id: 8,
    				name: 9,
    				labelText: 10,
    				hideLabel: 11,
    				invalid: 12,
    				invalidText: 13,
    				warn: 14,
    				warnText: 15,
    				ref: 1,
    				required: 16,
    				inline: 17
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get size() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\Toggle\Toggle.svelte generated by Svelte v3.38.2 */
    const file$k = "node_modules\\carbon-components-svelte\\src\\Toggle\\Toggle.svelte";

    function create_fragment$l(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let t1;
    	let t2;
    	let span2;
    	let span0;
    	let t3;
    	let t4;
    	let span1;
    	let t5;
    	let label_aria_label_value;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[8]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(/*labelText*/ ctx[5]);
    			t2 = space();
    			span2 = element("span");
    			span0 = element("span");
    			t3 = text(/*labelA*/ ctx[3]);
    			t4 = space();
    			span1 = element("span");
    			t5 = text(/*labelB*/ ctx[4]);
    			attr_dev(input, "type", "checkbox");
    			input.checked = /*toggled*/ ctx[0];
    			input.disabled = /*disabled*/ ctx[2];
    			attr_dev(input, "id", /*id*/ ctx[6]);
    			attr_dev(input, "name", /*name*/ ctx[7]);
    			toggle_class(input, "bx--toggle-input", true);
    			toggle_class(input, "bx--toggle-input--small", /*size*/ ctx[1] === "sm");
    			add_location(input, file$k, 50, 2, 1029);
    			attr_dev(span0, "aria-hidden", "true");
    			toggle_class(span0, "bx--toggle__text--off", true);
    			add_location(span0, file$k, 79, 6, 1700);
    			attr_dev(span1, "aria-hidden", "true");
    			toggle_class(span1, "bx--toggle__text--on", true);
    			add_location(span1, file$k, 82, 6, 1800);
    			toggle_class(span2, "bx--toggle__switch", true);
    			add_location(span2, file$k, 78, 4, 1653);

    			attr_dev(label, "aria-label", label_aria_label_value = /*labelText*/ ctx[5]
    			? undefined
    			: /*$$props*/ ctx[9]["aria-label"] || "Toggle");

    			attr_dev(label, "for", /*id*/ ctx[6]);
    			toggle_class(label, "bx--toggle-input__label", true);
    			add_location(label, file$k, 72, 2, 1487);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--form-item", true);
    			add_location(div, file$k, 42, 0, 912);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, t1);
    			append_dev(label, t2);
    			append_dev(label, span2);
    			append_dev(span2, span0);
    			append_dev(span0, t3);
    			append_dev(span2, t4);
    			append_dev(span2, span1);
    			append_dev(span1, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[14], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[18], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[15], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler_1*/ ctx[19], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[16], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[17], false, false, false),
    					listen_dev(div, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[11], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler*/ ctx[12], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*toggled*/ 1) {
    				prop_dev(input, "checked", /*toggled*/ ctx[0]);
    			}

    			if (dirty & /*disabled*/ 4) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[2]);
    			}

    			if (dirty & /*id*/ 64) {
    				attr_dev(input, "id", /*id*/ ctx[6]);
    			}

    			if (dirty & /*name*/ 128) {
    				attr_dev(input, "name", /*name*/ ctx[7]);
    			}

    			if (dirty & /*size*/ 2) {
    				toggle_class(input, "bx--toggle-input--small", /*size*/ ctx[1] === "sm");
    			}

    			if (dirty & /*labelText*/ 32) set_data_dev(t1, /*labelText*/ ctx[5]);
    			if (dirty & /*labelA*/ 8) set_data_dev(t3, /*labelA*/ ctx[3]);
    			if (dirty & /*labelB*/ 16) set_data_dev(t5, /*labelB*/ ctx[4]);

    			if (dirty & /*labelText, $$props*/ 544 && label_aria_label_value !== (label_aria_label_value = /*labelText*/ ctx[5]
    			? undefined
    			: /*$$props*/ ctx[9]["aria-label"] || "Toggle")) {
    				attr_dev(label, "aria-label", label_aria_label_value);
    			}

    			if (dirty & /*id*/ 64) {
    				attr_dev(label, "for", /*id*/ ctx[6]);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8]]));
    			toggle_class(div, "bx--form-item", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","toggled","disabled","labelA","labelB","labelText","id","name"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Toggle", slots, []);
    	let { size = "default" } = $$props;
    	let { toggled = false } = $$props;
    	let { disabled = false } = $$props;
    	let { labelA = "Off" } = $$props;
    	let { labelB = "On" } = $$props;
    	let { labelText = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	const dispatch = createEventDispatcher();

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function change_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	const change_handler_1 = () => {
    		$$invalidate(0, toggled = !toggled);
    	};

    	const keyup_handler_1 = e => {
    		if (e.key === " " || e.key === "Enter") {
    			e.preventDefault();
    			$$invalidate(0, toggled = !toggled);
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("size" in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ("toggled" in $$new_props) $$invalidate(0, toggled = $$new_props.toggled);
    		if ("disabled" in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("labelA" in $$new_props) $$invalidate(3, labelA = $$new_props.labelA);
    		if ("labelB" in $$new_props) $$invalidate(4, labelB = $$new_props.labelB);
    		if ("labelText" in $$new_props) $$invalidate(5, labelText = $$new_props.labelText);
    		if ("id" in $$new_props) $$invalidate(6, id = $$new_props.id);
    		if ("name" in $$new_props) $$invalidate(7, name = $$new_props.name);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		toggled,
    		disabled,
    		labelA,
    		labelB,
    		labelText,
    		id,
    		name,
    		createEventDispatcher,
    		dispatch
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
    		if ("size" in $$props) $$invalidate(1, size = $$new_props.size);
    		if ("toggled" in $$props) $$invalidate(0, toggled = $$new_props.toggled);
    		if ("disabled" in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ("labelA" in $$props) $$invalidate(3, labelA = $$new_props.labelA);
    		if ("labelB" in $$props) $$invalidate(4, labelB = $$new_props.labelB);
    		if ("labelText" in $$props) $$invalidate(5, labelText = $$new_props.labelText);
    		if ("id" in $$props) $$invalidate(6, id = $$new_props.id);
    		if ("name" in $$props) $$invalidate(7, name = $$new_props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*toggled*/ 1) {
    			dispatch("toggle", { toggled });
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		toggled,
    		size,
    		disabled,
    		labelA,
    		labelB,
    		labelText,
    		id,
    		name,
    		$$restProps,
    		$$props,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		change_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		change_handler_1,
    		keyup_handler_1
    	];
    }

    class Toggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			size: 1,
    			toggled: 0,
    			disabled: 2,
    			labelA: 3,
    			labelB: 4,
    			labelText: 5,
    			id: 6,
    			name: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get size() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggled() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggled(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelA() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelA(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelB() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelB(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const shouldRenderHamburgerMenu = writable(false);

    /* node_modules\carbon-icons-svelte\lib\Menu20\Menu20.svelte generated by Svelte v3.38.2 */

    const file$j = "node_modules\\carbon-icons-svelte\\lib\\Menu20\\Menu20.svelte";

    // (39:4) {#if title}
    function create_if_block$9(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[2]);
    			add_location(title_1, file$j, 39, 6, 1086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(39:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (38:8)      
    function fallback_block$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[2] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(38:8)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let svg;
    	let path;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$3(ctx);

    	let svg_levels = [
    		{ "data-carbon-icon": "Menu20" },
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 20 20" },
    		{ fill: "currentColor" },
    		{ width: "20" },
    		{ height: "20" },
    		{ class: /*className*/ ctx[0] },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ style: /*style*/ ctx[3] },
    		{ id: /*id*/ ctx[1] },
    		/*attributes*/ ctx[4]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(path, "d", "M2 14.8H18V16H2zM2 11.2H18V12.399999999999999H2zM2 7.6H18V8.799999999999999H2zM2 4H18V5.2H2z");
    			add_location(path, file$j, 36, 2, 944);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$j, 22, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svg, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(svg, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(svg, "mouseover", /*mouseover_handler*/ ctx[13], false, false, false),
    					listen_dev(svg, "mouseenter", /*mouseenter_handler*/ ctx[14], false, false, false),
    					listen_dev(svg, "mouseleave", /*mouseleave_handler*/ ctx[15], false, false, false),
    					listen_dev(svg, "keyup", /*keyup_handler*/ ctx[16], false, false, false),
    					listen_dev(svg, "keydown", /*keydown_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*title*/ 4) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ "data-carbon-icon": "Menu20" },
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 20 20" },
    				{ fill: "currentColor" },
    				{ width: "20" },
    				{ height: "20" },
    				(!current || dirty & /*className*/ 1) && { class: /*className*/ ctx[0] },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				(!current || dirty & /*style*/ 8) && { style: /*style*/ ctx[3] },
    				(!current || dirty & /*id*/ 2) && { id: /*id*/ ctx[1] },
    				dirty & /*attributes*/ 16 && /*attributes*/ ctx[4]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let ariaLabelledBy;
    	let labelled;
    	let attributes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Menu20", slots, ['default']);
    	let { class: className = undefined } = $$props;
    	let { id = undefined } = $$props;
    	let { tabindex = undefined } = $$props;
    	let { focusable = false } = $$props;
    	let { title = undefined } = $$props;
    	let { style = undefined } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("class" in $$new_props) $$invalidate(0, className = $$new_props.class);
    		if ("id" in $$new_props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$new_props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$new_props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$new_props) $$invalidate(3, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		className,
    		id,
    		tabindex,
    		focusable,
    		title,
    		style,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		attributes
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("className" in $$props) $$invalidate(0, className = $$new_props.className);
    		if ("id" in $$props) $$invalidate(1, id = $$new_props.id);
    		if ("tabindex" in $$props) $$invalidate(5, tabindex = $$new_props.tabindex);
    		if ("focusable" in $$props) $$invalidate(6, focusable = $$new_props.focusable);
    		if ("title" in $$props) $$invalidate(2, title = $$new_props.title);
    		if ("style" in $$props) $$invalidate(3, style = $$new_props.style);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    		if ("ariaLabelledBy" in $$props) $$invalidate(8, ariaLabelledBy = $$new_props.ariaLabelledBy);
    		if ("labelled" in $$props) $$invalidate(9, labelled = $$new_props.labelled);
    		if ("attributes" in $$props) $$invalidate(4, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(7, ariaLabel = $$props["aria-label"]);
    		$$invalidate(8, ariaLabelledBy = $$props["aria-labelledby"]);

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, title*/ 388) {
    			$$invalidate(9, labelled = ariaLabel || ariaLabelledBy || title);
    		}

    		if ($$self.$$.dirty & /*ariaLabel, ariaLabelledBy, labelled, tabindex, focusable*/ 992) {
    			$$invalidate(4, attributes = {
    				"aria-label": ariaLabel,
    				"aria-labelledby": ariaLabelledBy,
    				"aria-hidden": labelled ? undefined : true,
    				role: labelled ? "img" : undefined,
    				focusable: tabindex === "0" ? true : focusable,
    				tabindex
    			});
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		className,
    		id,
    		title,
    		style,
    		attributes,
    		tabindex,
    		focusable,
    		ariaLabel,
    		ariaLabelledBy,
    		labelled,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler
    	];
    }

    class Menu20 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			class: 0,
    			id: 1,
    			tabindex: 5,
    			focusable: 6,
    			title: 2,
    			style: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu20",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get class() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focusable() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focusable(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Menu20>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Menu20>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\HamburgerMenu.svelte generated by Svelte v3.38.2 */
    const file$i = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\HamburgerMenu.svelte";

    function create_fragment$j(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				title: /*isOpen*/ ctx[0] ? "Close" : "Open Menu",
    				render: /*isOpen*/ ctx[0] ? Close20 : Menu20
    			},
    			$$inline: true
    		});

    	let button_levels = [
    		{ type: "button" },
    		{ title: "Open menu" },
    		{ "aria-label": /*ariaLabel*/ ctx[2] },
    		/*$$restProps*/ ctx[3]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			set_attributes(button, button_data);
    			toggle_class(button, "bx--header__action", true);
    			toggle_class(button, "bx--header__menu-trigger", true);
    			toggle_class(button, "bx--header__menu-toggle", true);
    			add_location(button, file$i, 18, 0, 469);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			/*button_binding*/ ctx[5](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const icon_changes = {};
    			if (dirty & /*isOpen*/ 1) icon_changes.title = /*isOpen*/ ctx[0] ? "Close" : "Open Menu";
    			if (dirty & /*isOpen*/ 1) icon_changes.render = /*isOpen*/ ctx[0] ? Close20 : Menu20;
    			icon.$set(icon_changes);

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				{ title: "Open menu" },
    				(!current || dirty & /*ariaLabel*/ 4) && { "aria-label": /*ariaLabel*/ ctx[2] },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(button, "bx--header__action", true);
    			toggle_class(button, "bx--header__menu-trigger", true);
    			toggle_class(button, "bx--header__menu-toggle", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			/*button_binding*/ ctx[5](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	const omit_props_names = ["ariaLabel","isOpen","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HamburgerMenu", slots, []);
    	let { ariaLabel = undefined } = $$props;
    	let { isOpen = false } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const click_handler_1 = () => $$invalidate(0, isOpen = !isOpen);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("ariaLabel" in $$new_props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ("isOpen" in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({
    		ariaLabel,
    		isOpen,
    		ref,
    		Close20,
    		Menu20,
    		Icon
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("ariaLabel" in $$props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpen,
    		ref,
    		ariaLabel,
    		$$restProps,
    		click_handler,
    		button_binding,
    		click_handler_1
    	];
    }

    class HamburgerMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { ariaLabel: 2, isOpen: 0, ref: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HamburgerMenu",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get ariaLabel() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\GlobalHeader\Header.svelte generated by Svelte v3.38.2 */
    const file$h = "node_modules\\carbon-components-svelte\\src\\UIShell\\GlobalHeader\\Header.svelte";
    const get_platform_slot_changes = dirty => ({});
    const get_platform_slot_context = ctx => ({});
    const get_skip_to_content_slot_changes = dirty => ({});
    const get_skip_to_content_slot_context = ctx => ({});

    // (54:2) {#if ($shouldRenderHamburgerMenu && winWidth < 1056) || persistentHamburgerMenu}
    function create_if_block_1$2(ctx) {
    	let hamburgermenu;
    	let updating_isOpen;
    	let current;

    	function hamburgermenu_isOpen_binding(value) {
    		/*hamburgermenu_isOpen_binding*/ ctx[16](value);
    	}

    	let hamburgermenu_props = {};

    	if (/*isSideNavOpen*/ ctx[0] !== void 0) {
    		hamburgermenu_props.isOpen = /*isSideNavOpen*/ ctx[0];
    	}

    	hamburgermenu = new HamburgerMenu({
    			props: hamburgermenu_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(hamburgermenu, "isOpen", hamburgermenu_isOpen_binding));

    	const block = {
    		c: function create() {
    			create_component(hamburgermenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hamburgermenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const hamburgermenu_changes = {};

    			if (!updating_isOpen && dirty & /*isSideNavOpen*/ 1) {
    				updating_isOpen = true;
    				hamburgermenu_changes.isOpen = /*isSideNavOpen*/ ctx[0];
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			hamburgermenu.$set(hamburgermenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hamburgermenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hamburgermenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hamburgermenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(54:2) {#if ($shouldRenderHamburgerMenu && winWidth < 1056) || persistentHamburgerMenu}",
    		ctx
    	});

    	return block;
    }

    // (64:4) {#if company}
    function create_if_block$8(ctx) {
    	let span;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*company*/ ctx[3]);
    			t1 = text(" ");
    			toggle_class(span, "bx--header__name--prefix", true);
    			add_location(span, file$h, 64, 6, 1662);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*company*/ 8) set_data_dev(t0, /*company*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(64:4) {#if company}",
    		ctx
    	});

    	return block;
    }

    // (67:26) {platformName}
    function fallback_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*platformName*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*platformName*/ 16) set_data_dev(t, /*platformName*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(67:26) {platformName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let header;
    	let t0;
    	let t1;
    	let a;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[15]);
    	const skip_to_content_slot_template = /*#slots*/ ctx[13]["skip-to-content"];
    	const skip_to_content_slot = create_slot(skip_to_content_slot_template, ctx, /*$$scope*/ ctx[12], get_skip_to_content_slot_context);
    	let if_block0 = (/*$shouldRenderHamburgerMenu*/ ctx[8] && /*winWidth*/ ctx[6] < 1056 || /*persistentHamburgerMenu*/ ctx[5]) && create_if_block_1$2(ctx);
    	let if_block1 = /*company*/ ctx[3] && create_if_block$8(ctx);
    	const platform_slot_template = /*#slots*/ ctx[13].platform;
    	const platform_slot = create_slot(platform_slot_template, ctx, /*$$scope*/ ctx[12], get_platform_slot_context);
    	const platform_slot_or_fallback = platform_slot || fallback_block$2(ctx);
    	let a_levels = [{ href: /*href*/ ctx[2] }, /*$$restProps*/ ctx[9]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			header = element("header");
    			if (skip_to_content_slot) skip_to_content_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			a = element("a");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (platform_slot_or_fallback) platform_slot_or_fallback.c();
    			t3 = space();
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--header__name", true);
    			add_location(a, file$h, 56, 2, 1521);
    			attr_dev(header, "role", "banner");
    			attr_dev(header, "aria-label", /*ariaLabel*/ ctx[7]);
    			toggle_class(header, "bx--header", true);
    			add_location(header, file$h, 51, 0, 1268);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);

    			if (skip_to_content_slot) {
    				skip_to_content_slot.m(header, null);
    			}

    			append_dev(header, t0);
    			if (if_block0) if_block0.m(header, null);
    			append_dev(header, t1);
    			append_dev(header, a);
    			if (if_block1) if_block1.m(a, null);
    			append_dev(a, t2);

    			if (platform_slot_or_fallback) {
    				platform_slot_or_fallback.m(a, null);
    			}

    			/*a_binding*/ ctx[17](a);
    			append_dev(header, t3);

    			if (default_slot) {
    				default_slot.m(header, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[15]),
    					listen_dev(a, "click", /*click_handler*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (skip_to_content_slot) {
    				if (skip_to_content_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot(skip_to_content_slot, skip_to_content_slot_template, ctx, /*$$scope*/ ctx[12], dirty, get_skip_to_content_slot_changes, get_skip_to_content_slot_context);
    				}
    			}

    			if (/*$shouldRenderHamburgerMenu*/ ctx[8] && /*winWidth*/ ctx[6] < 1056 || /*persistentHamburgerMenu*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$shouldRenderHamburgerMenu, winWidth, persistentHamburgerMenu*/ 352) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(header, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*company*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$8(ctx);
    					if_block1.c();
    					if_block1.m(a, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (platform_slot) {
    				if (platform_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot(platform_slot, platform_slot_template, ctx, /*$$scope*/ ctx[12], dirty, get_platform_slot_changes, get_platform_slot_context);
    				}
    			} else {
    				if (platform_slot_or_fallback && platform_slot_or_fallback.p && dirty & /*platformName*/ 16) {
    					platform_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9]
    			]));

    			toggle_class(a, "bx--header__name", true);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*ariaLabel*/ 128) {
    				attr_dev(header, "aria-label", /*ariaLabel*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skip_to_content_slot, local);
    			transition_in(if_block0);
    			transition_in(platform_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skip_to_content_slot, local);
    			transition_out(if_block0);
    			transition_out(platform_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (skip_to_content_slot) skip_to_content_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (platform_slot_or_fallback) platform_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[17](null);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let ariaLabel;

    	const omit_props_names = [
    		"expandedByDefault","isSideNavOpen","uiShellAriaLabel","href","company","platformName","persistentHamburgerMenu","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $shouldRenderHamburgerMenu;
    	validate_store(shouldRenderHamburgerMenu, "shouldRenderHamburgerMenu");
    	component_subscribe($$self, shouldRenderHamburgerMenu, $$value => $$invalidate(8, $shouldRenderHamburgerMenu = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, ['skip-to-content','platform','default']);
    	let { expandedByDefault = true } = $$props;
    	let { isSideNavOpen = false } = $$props;
    	let { uiShellAriaLabel = undefined } = $$props;
    	let { href = undefined } = $$props;
    	let { company = undefined } = $$props;
    	let { platformName = "" } = $$props;
    	let { persistentHamburgerMenu = false } = $$props;
    	let { ref = null } = $$props;
    	let winWidth = undefined;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(6, winWidth = window.innerWidth);
    	}

    	function hamburgermenu_isOpen_binding(value) {
    		isSideNavOpen = value;
    		((($$invalidate(0, isSideNavOpen), $$invalidate(10, expandedByDefault)), $$invalidate(6, winWidth)), $$invalidate(5, persistentHamburgerMenu));
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("expandedByDefault" in $$new_props) $$invalidate(10, expandedByDefault = $$new_props.expandedByDefault);
    		if ("isSideNavOpen" in $$new_props) $$invalidate(0, isSideNavOpen = $$new_props.isSideNavOpen);
    		if ("uiShellAriaLabel" in $$new_props) $$invalidate(11, uiShellAriaLabel = $$new_props.uiShellAriaLabel);
    		if ("href" in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ("company" in $$new_props) $$invalidate(3, company = $$new_props.company);
    		if ("platformName" in $$new_props) $$invalidate(4, platformName = $$new_props.platformName);
    		if ("persistentHamburgerMenu" in $$new_props) $$invalidate(5, persistentHamburgerMenu = $$new_props.persistentHamburgerMenu);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		expandedByDefault,
    		isSideNavOpen,
    		uiShellAriaLabel,
    		href,
    		company,
    		platformName,
    		persistentHamburgerMenu,
    		ref,
    		shouldRenderHamburgerMenu,
    		HamburgerMenu,
    		winWidth,
    		ariaLabel,
    		$shouldRenderHamburgerMenu
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("expandedByDefault" in $$props) $$invalidate(10, expandedByDefault = $$new_props.expandedByDefault);
    		if ("isSideNavOpen" in $$props) $$invalidate(0, isSideNavOpen = $$new_props.isSideNavOpen);
    		if ("uiShellAriaLabel" in $$props) $$invalidate(11, uiShellAriaLabel = $$new_props.uiShellAriaLabel);
    		if ("href" in $$props) $$invalidate(2, href = $$new_props.href);
    		if ("company" in $$props) $$invalidate(3, company = $$new_props.company);
    		if ("platformName" in $$props) $$invalidate(4, platformName = $$new_props.platformName);
    		if ("persistentHamburgerMenu" in $$props) $$invalidate(5, persistentHamburgerMenu = $$new_props.persistentHamburgerMenu);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ("winWidth" in $$props) $$invalidate(6, winWidth = $$new_props.winWidth);
    		if ("ariaLabel" in $$props) $$invalidate(7, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*expandedByDefault, winWidth, persistentHamburgerMenu*/ 1120) {
    			$$invalidate(0, isSideNavOpen = expandedByDefault && winWidth >= 1056 && !persistentHamburgerMenu);
    		}

    		$$invalidate(7, ariaLabel = company
    		? `${company} `
    		: "" + (uiShellAriaLabel || $$props["aria-label"] || platformName));
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		isSideNavOpen,
    		ref,
    		href,
    		company,
    		platformName,
    		persistentHamburgerMenu,
    		winWidth,
    		ariaLabel,
    		$shouldRenderHamburgerMenu,
    		$$restProps,
    		expandedByDefault,
    		uiShellAriaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		onwindowresize,
    		hamburgermenu_isOpen_binding,
    		a_binding
    	];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			expandedByDefault: 10,
    			isSideNavOpen: 0,
    			uiShellAriaLabel: 11,
    			href: 2,
    			company: 3,
    			platformName: 4,
    			persistentHamburgerMenu: 5,
    			ref: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get expandedByDefault() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandedByDefault(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSideNavOpen() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSideNavOpen(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uiShellAriaLabel() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uiShellAriaLabel(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get company() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set company(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get platformName() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set platformName(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get persistentHamburgerMenu() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set persistentHamburgerMenu(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\GlobalHeader\HeaderNav.svelte generated by Svelte v3.38.2 */

    const file$g = "node_modules\\carbon-components-svelte\\src\\UIShell\\GlobalHeader\\HeaderNav.svelte";

    function create_fragment$h(ctx) {
    	let nav;
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	let ul_levels = [/*props*/ ctx[0]];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	let nav_levels = [/*props*/ ctx[0], /*$$restProps*/ ctx[1]];
    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			toggle_class(ul, "bx--header__menu-bar", true);
    			add_location(ul, file$g, 15, 2, 363);
    			set_attributes(nav, nav_data);
    			toggle_class(nav, "bx--header__nav", true);
    			add_location(nav, file$g, 14, 0, 296);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [dirty & /*props*/ 1 && /*props*/ ctx[0]]));
    			toggle_class(ul, "bx--header__menu-bar", true);

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*props*/ 1 && /*props*/ ctx[0],
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
    			]));

    			toggle_class(nav, "bx--header__nav", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let props;
    	const omit_props_names = ["ariaLabel"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HeaderNav", slots, ['default']);
    	let { ariaLabel = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("ariaLabel" in $$new_props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ ariaLabel, props });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ("ariaLabel" in $$props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ("props" in $$props) $$invalidate(0, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(0, props = {
    			"aria-label": ariaLabel || $$props["aria-label"],
    			"aria-labelledby": $$props["aria-labelledby"]
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [props, $$restProps, ariaLabel, $$scope, slots];
    }

    class HeaderNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { ariaLabel: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderNav",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get ariaLabel() {
    		throw new Error("<HeaderNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<HeaderNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\GlobalHeader\HeaderNavItem.svelte generated by Svelte v3.38.2 */

    const file$f = "node_modules\\carbon-components-svelte\\src\\UIShell\\GlobalHeader\\HeaderNavItem.svelte";

    function create_fragment$g(ctx) {
    	let li;
    	let a;
    	let span;
    	let t;
    	let a_rel_value;
    	let mounted;
    	let dispose;

    	let a_levels = [
    		{ role: "menuitem" },
    		{ tabindex: "0" },
    		{ href: /*href*/ ctx[1] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[3].target === "_blank"
    			? "noopener noreferrer"
    			: undefined
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			span = element("span");
    			t = text(/*text*/ ctx[2]);
    			toggle_class(span, "bx--text-truncate--end", true);
    			add_location(span, file$f, 35, 4, 640);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--header__menu-item", true);
    			add_location(a, file$f, 18, 2, 291);
    			add_location(li, file$f, 17, 0, 284);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, span);
    			append_dev(span, t);
    			/*a_binding*/ ctx[12](a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[5], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[6], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[7], false, false, false),
    					listen_dev(a, "keyup", /*keyup_handler*/ ctx[8], false, false, false),
    					listen_dev(a, "keydown", /*keydown_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "focus", /*focus_handler*/ ctx[10], false, false, false),
    					listen_dev(a, "blur", /*blur_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 4) set_data_dev(t, /*text*/ ctx[2]);

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				{ role: "menuitem" },
    				{ tabindex: "0" },
    				dirty & /*href*/ 2 && { href: /*href*/ ctx[1] },
    				dirty & /*$$restProps*/ 8 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[3].target === "_blank"
    				? "noopener noreferrer"
    				: undefined) && { rel: a_rel_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(a, "bx--header__menu-item", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			/*a_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","text","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HeaderNavItem", slots, []);
    	let { href = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("href" in $$new_props) $$invalidate(1, href = $$new_props.href);
    		if ("text" in $$new_props) $$invalidate(2, text = $$new_props.text);
    		if ("ref" in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({ href, text, ref });

    	$$self.$inject_state = $$new_props => {
    		if ("href" in $$props) $$invalidate(1, href = $$new_props.href);
    		if ("text" in $$props) $$invalidate(2, text = $$new_props.text);
    		if ("ref" in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ref,
    		href,
    		text,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler,
    		focus_handler,
    		blur_handler,
    		a_binding
    	];
    }

    class HeaderNavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { href: 1, text: 2, ref: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderNavItem",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get href() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\GlobalHeader\HeaderNavMenu.svelte generated by Svelte v3.38.2 */
    const file$e = "node_modules\\carbon-components-svelte\\src\\UIShell\\GlobalHeader\\HeaderNavMenu.svelte";

    function create_fragment$f(ctx) {
    	let li;
    	let a;
    	let t0;
    	let t1;
    	let chevrondown16;
    	let t2;
    	let ul;
    	let current;
    	let mounted;
    	let dispose;

    	chevrondown16 = new ChevronDown16({
    			props: { class: "bx--header__menu-arrow" },
    			$$inline: true
    		});

    	let a_levels = [
    		{ role: "menuitem" },
    		{ tabindex: "0" },
    		{ "aria-haspopup": "menu" },
    		{ "aria-expanded": /*expanded*/ ctx[0] },
    		{ "aria-label": /*text*/ ctx[3] },
    		{ href: /*href*/ ctx[2] },
    		/*$$restProps*/ ctx[4]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(/*text*/ ctx[3]);
    			t1 = space();
    			create_component(chevrondown16.$$.fragment);
    			t2 = space();
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--header__menu-item", true);
    			toggle_class(a, "bx--header__menu-title", true);
    			add_location(a, file$e, 32, 2, 657);
    			attr_dev(ul, "role", "menu");
    			attr_dev(ul, "aria-label", /*text*/ ctx[3]);
    			toggle_class(ul, "bx--header__menu", true);
    			add_location(ul, file$e, 60, 2, 1239);
    			toggle_class(li, "bx--header__submenu", true);
    			add_location(li, file$e, 31, 0, 615);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(a, t1);
    			mount_component(chevrondown16, a, null);
    			/*a_binding*/ ctx[16](a);
    			append_dev(li, t2);
    			append_dev(li, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mouseup", /*mouseup_handler*/ ctx[15], false, false, false),
    					listen_dev(a, "keydown", /*keydown_handler*/ ctx[7], false, false, false),
    					listen_dev(a, "keydown", /*keydown_handler_1*/ ctx[17], false, false, false),
    					listen_dev(a, "click", prevent_default(/*click_handler*/ ctx[8]), false, true, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[10], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[11], false, false, false),
    					listen_dev(a, "keyup", /*keyup_handler*/ ctx[12], false, false, false),
    					listen_dev(a, "focus", /*focus_handler*/ ctx[13], false, false, false),
    					listen_dev(a, "blur", /*blur_handler*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*text*/ 8) set_data_dev(t0, /*text*/ ctx[3]);

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				{ role: "menuitem" },
    				{ tabindex: "0" },
    				{ "aria-haspopup": "menu" },
    				(!current || dirty & /*expanded*/ 1) && { "aria-expanded": /*expanded*/ ctx[0] },
    				(!current || dirty & /*text*/ 8) && { "aria-label": /*text*/ ctx[3] },
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			toggle_class(a, "bx--header__menu-item", true);
    			toggle_class(a, "bx--header__menu-title", true);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*text*/ 8) {
    				attr_dev(ul, "aria-label", /*text*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevrondown16.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevrondown16.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(chevrondown16);
    			/*a_binding*/ ctx[16](null);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["expanded","href","text","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("HeaderNavMenu", slots, ['default']);
    	let { expanded = false } = $$props;
    	let { href = "/" } = $$props;
    	let { text = undefined } = $$props;
    	let { ref = null } = $$props;

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble($$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble($$self, event);
    	}

    	function keyup_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	const mouseup_handler = ({ target }) => {
    		if (ref.contains(target) || target === ref) {
    			$$invalidate(0, expanded = !expanded);
    		} else {
    			if (expanded) {
    				$$invalidate(0, expanded = false);
    			}
    		}
    	};

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const keydown_handler_1 = ({ key }) => {
    		if (key === "Enter") {
    			$$invalidate(0, expanded = !expanded);
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("expanded" in $$new_props) $$invalidate(0, expanded = $$new_props.expanded);
    		if ("href" in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ("text" in $$new_props) $$invalidate(3, text = $$new_props.text);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ expanded, href, text, ref, ChevronDown16 });

    	$$self.$inject_state = $$new_props => {
    		if ("expanded" in $$props) $$invalidate(0, expanded = $$new_props.expanded);
    		if ("href" in $$props) $$invalidate(2, href = $$new_props.href);
    		if ("text" in $$props) $$invalidate(3, text = $$new_props.text);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		expanded,
    		ref,
    		href,
    		text,
    		$$restProps,
    		$$scope,
    		slots,
    		keydown_handler,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		mouseup_handler,
    		a_binding,
    		keydown_handler_1
    	];
    }

    class HeaderNavMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { expanded: 0, href: 2, text: 3, ref: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderNavMenu",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get expanded() {
    		throw new Error("<HeaderNavMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<HeaderNavMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<HeaderNavMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<HeaderNavMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<HeaderNavMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<HeaderNavMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<HeaderNavMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<HeaderNavMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\SideNav.svelte generated by Svelte v3.38.2 */
    const file$d = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\SideNav.svelte";

    // (23:0) {#if !fixed}
    function create_if_block$7(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			toggle_class(div, "bx--side-nav__overlay", true);
    			toggle_class(div, "bx--side-nav__overlay-active", /*isOpen*/ ctx[0]);
    			add_location(div, file$d, 23, 2, 519);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isOpen*/ 1) {
    				toggle_class(div, "bx--side-nav__overlay-active", /*isOpen*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(23:0) {#if !fixed}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let t;
    	let nav;
    	let nav_aria_hidden_value;
    	let current;
    	let if_block = !/*fixed*/ ctx[1] && create_if_block$7(ctx);
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	let nav_levels = [
    		{
    			"aria-hidden": nav_aria_hidden_value = !/*isOpen*/ ctx[0]
    		},
    		{ "aria-label": /*ariaLabel*/ ctx[2] },
    		/*$$restProps*/ ctx[3]
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			nav = element("nav");
    			if (default_slot) default_slot.c();
    			set_attributes(nav, nav_data);
    			toggle_class(nav, "bx--side-nav__navigation", true);
    			toggle_class(nav, "bx--side-nav", true);
    			toggle_class(nav, "bx--side-nav--ux", true);
    			toggle_class(nav, "bx--side-nav--expanded", /*isOpen*/ ctx[0]);
    			toggle_class(nav, "bx--side-nav--collapsed", !/*isOpen*/ ctx[0]);
    			add_location(nav, file$d, 31, 0, 684);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, nav, anchor);

    			if (default_slot) {
    				default_slot.m(nav, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*fixed*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				(!current || dirty & /*isOpen*/ 1 && nav_aria_hidden_value !== (nav_aria_hidden_value = !/*isOpen*/ ctx[0])) && { "aria-hidden": nav_aria_hidden_value },
    				(!current || dirty & /*ariaLabel*/ 4) && { "aria-label": /*ariaLabel*/ ctx[2] },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(nav, "bx--side-nav__navigation", true);
    			toggle_class(nav, "bx--side-nav", true);
    			toggle_class(nav, "bx--side-nav--ux", true);
    			toggle_class(nav, "bx--side-nav--expanded", /*isOpen*/ ctx[0]);
    			toggle_class(nav, "bx--side-nav--collapsed", !/*isOpen*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = ["fixed","ariaLabel","isOpen"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SideNav", slots, ['default']);
    	let { fixed = false } = $$props;
    	let { ariaLabel = undefined } = $$props;
    	let { isOpen = false } = $$props;

    	onMount(() => {
    		shouldRenderHamburgerMenu.set(true);
    		return () => shouldRenderHamburgerMenu.set(false);
    	});

    	const click_handler = () => {
    		$$invalidate(0, isOpen = false);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("fixed" in $$new_props) $$invalidate(1, fixed = $$new_props.fixed);
    		if ("ariaLabel" in $$new_props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ("isOpen" in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ("$$scope" in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fixed,
    		ariaLabel,
    		isOpen,
    		onMount,
    		shouldRenderHamburgerMenu
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("fixed" in $$props) $$invalidate(1, fixed = $$new_props.fixed);
    		if ("ariaLabel" in $$props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ("isOpen" in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isOpen, fixed, ariaLabel, $$restProps, $$scope, slots, click_handler];
    }

    class SideNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { fixed: 1, ariaLabel: 2, isOpen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNav",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get fixed() {
    		throw new Error("<SideNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<SideNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<SideNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<SideNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<SideNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<SideNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\SideNavItems.svelte generated by Svelte v3.38.2 */

    const file$c = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\SideNavItems.svelte";

    function create_fragment$d(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			toggle_class(ul, "bx--side-nav__items", true);
    			add_location(ul, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SideNavItems", slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SideNavItems> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class SideNavItems extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNavItems",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\SideNavLink.svelte generated by Svelte v3.38.2 */
    const file$b = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\SideNavLink.svelte";

    // (40:4) {#if icon}
    function create_if_block$6(ctx) {
    	let div;
    	let icon_1;
    	let current;

    	icon_1 = new Icon({
    			props: { render: /*icon*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon_1.$$.fragment);
    			toggle_class(div, "bx--side-nav__icon", true);
    			toggle_class(div, "bx--side-nav__icon--small", true);
    			add_location(div, file$b, 40, 6, 945);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon_1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty & /*icon*/ 16) icon_1_changes.render = /*icon*/ ctx[4];
    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(40:4) {#if icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let li;
    	let a;
    	let t0;
    	let span;
    	let t1;
    	let a_aria_current_value;
    	let a_rel_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*icon*/ ctx[4] && create_if_block$6(ctx);

    	let a_levels = [
    		{
    			"aria-current": a_aria_current_value = /*isSelected*/ ctx[1] ? "page" : undefined
    		},
    		{ href: /*href*/ ctx[2] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[5].target === "_blank"
    			? "noopener noreferrer"
    			: undefined
    		},
    		/*$$restProps*/ ctx[5]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			if (if_block) if_block.c();
    			t0 = space();
    			span = element("span");
    			t1 = text(/*text*/ ctx[3]);
    			toggle_class(span, "bx--side-nav__link-text", true);
    			add_location(span, file$b, 47, 4, 1109);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--side-nav__link", true);
    			toggle_class(a, "bx--side-nav__link--current", /*isSelected*/ ctx[1]);
    			add_location(a, file$b, 29, 2, 619);
    			toggle_class(li, "bx--side-nav__item", true);
    			add_location(li, file$b, 28, 0, 578);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t0);
    			append_dev(a, span);
    			append_dev(span, t1);
    			/*a_binding*/ ctx[7](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*icon*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*icon*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(a, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*text*/ 8) set_data_dev(t1, /*text*/ ctx[3]);

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*isSelected*/ 2 && a_aria_current_value !== (a_aria_current_value = /*isSelected*/ ctx[1] ? "page" : undefined)) && { "aria-current": a_aria_current_value },
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				(!current || dirty & /*$$restProps*/ 32 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[5].target === "_blank"
    				? "noopener noreferrer"
    				: undefined)) && { rel: a_rel_value },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			toggle_class(a, "bx--side-nav__link", true);
    			toggle_class(a, "bx--side-nav__link--current", /*isSelected*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			/*a_binding*/ ctx[7](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const omit_props_names = ["isSelected","href","text","icon","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SideNavLink", slots, []);
    	let { isSelected = false } = $$props;
    	let { href = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { icon = undefined } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("isSelected" in $$new_props) $$invalidate(1, isSelected = $$new_props.isSelected);
    		if ("href" in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ("text" in $$new_props) $$invalidate(3, text = $$new_props.text);
    		if ("icon" in $$new_props) $$invalidate(4, icon = $$new_props.icon);
    		if ("ref" in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({ isSelected, href, text, icon, ref, Icon });

    	$$self.$inject_state = $$new_props => {
    		if ("isSelected" in $$props) $$invalidate(1, isSelected = $$new_props.isSelected);
    		if ("href" in $$props) $$invalidate(2, href = $$new_props.href);
    		if ("text" in $$props) $$invalidate(3, text = $$new_props.text);
    		if ("icon" in $$props) $$invalidate(4, icon = $$new_props.icon);
    		if ("ref" in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, isSelected, href, text, icon, $$restProps, click_handler, a_binding];
    }

    class SideNavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			isSelected: 1,
    			href: 2,
    			text: 3,
    			icon: 4,
    			ref: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNavLink",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get isSelected() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<SideNavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<SideNavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\SideNavMenu.svelte generated by Svelte v3.38.2 */
    const file$a = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\SideNavMenu.svelte";

    // (36:4) {#if icon}
    function create_if_block$5(ctx) {
    	let div;
    	let icon_1;
    	let current;

    	icon_1 = new Icon({
    			props: { render: /*icon*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon_1.$$.fragment);
    			toggle_class(div, "bx--side-nav__icon", true);
    			add_location(div, file$a, 36, 6, 889);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon_1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty & /*icon*/ 8) icon_1_changes.render = /*icon*/ ctx[3];
    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(36:4) {#if icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let li;
    	let button;
    	let t0;
    	let span;
    	let t1;
    	let t2;
    	let div;
    	let icon_1;
    	let t3;
    	let ul;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*icon*/ ctx[3] && create_if_block$5(ctx);

    	icon_1 = new Icon({
    			props: {
    				title: "Open Menu",
    				tabindex: "0",
    				render: ChevronDown16
    			},
    			$$inline: true
    		});

    	let button_levels = [
    		{ type: "button" },
    		{ "aria-expanded": /*expanded*/ ctx[0] },
    		/*$$restProps*/ ctx[4]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			if (if_block) if_block.c();
    			t0 = space();
    			span = element("span");
    			t1 = text(/*text*/ ctx[2]);
    			t2 = space();
    			div = element("div");
    			create_component(icon_1.$$.fragment);
    			t3 = space();
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			toggle_class(span, "bx--side-nav__submenu-title", true);
    			add_location(span, file$a, 40, 4, 989);
    			toggle_class(div, "bx--side-nav__icon", true);
    			toggle_class(div, "bx--side-nav__icon--small", true);
    			toggle_class(div, "bx--side-nav__submenu-chevron", true);
    			add_location(div, file$a, 41, 4, 1056);
    			set_attributes(button, button_data);
    			toggle_class(button, "bx--side-nav__submenu", true);
    			add_location(button, file$a, 24, 2, 651);
    			attr_dev(ul, "role", "menu");
    			toggle_class(ul, "bx--side-nav__menu", true);
    			add_location(ul, file$a, 49, 2, 1301);
    			toggle_class(li, "bx--side-nav__item", true);
    			toggle_class(li, "bx--side-nav__item--icon", /*icon*/ ctx[3]);
    			add_location(li, file$a, 23, 0, 570);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t0);
    			append_dev(button, span);
    			append_dev(span, t1);
    			append_dev(button, t2);
    			append_dev(button, div);
    			mount_component(icon_1, div, null);
    			/*button_binding*/ ctx[8](button);
    			append_dev(li, t3);
    			append_dev(li, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*icon*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*icon*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*text*/ 4) set_data_dev(t1, /*text*/ ctx[2]);

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				(!current || dirty & /*expanded*/ 1) && { "aria-expanded": /*expanded*/ ctx[0] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			toggle_class(button, "bx--side-nav__submenu", true);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			if (dirty & /*icon*/ 8) {
    				toggle_class(li, "bx--side-nav__item--icon", /*icon*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(icon_1.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(icon_1.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			destroy_component(icon_1);
    			/*button_binding*/ ctx[8](null);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["expanded","text","icon","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SideNavMenu", slots, ['default']);
    	let { expanded = false } = $$props;
    	let { text = undefined } = $$props;
    	let { icon = undefined } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const click_handler_1 = () => {
    		$$invalidate(0, expanded = !expanded);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("expanded" in $$new_props) $$invalidate(0, expanded = $$new_props.expanded);
    		if ("text" in $$new_props) $$invalidate(2, text = $$new_props.text);
    		if ("icon" in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ("ref" in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		expanded,
    		text,
    		icon,
    		ref,
    		ChevronDown16,
    		Icon
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("expanded" in $$props) $$invalidate(0, expanded = $$new_props.expanded);
    		if ("text" in $$props) $$invalidate(2, text = $$new_props.text);
    		if ("icon" in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ("ref" in $$props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		expanded,
    		ref,
    		text,
    		icon,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		button_binding,
    		click_handler_1
    	];
    }

    class SideNavMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { expanded: 0, text: 2, icon: 3, ref: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNavMenu",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get expanded() {
    		throw new Error("<SideNavMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<SideNavMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SideNavMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SideNavMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<SideNavMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<SideNavMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<SideNavMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<SideNavMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\SideNav\SideNavMenuItem.svelte generated by Svelte v3.38.2 */

    const file$9 = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNav\\SideNavMenuItem.svelte";

    // (33:55) {text}
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*text*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 8) set_data_dev(t, /*text*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(33:55) {text}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let li;
    	let a;
    	let span;
    	let a_aria_current_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	let a_levels = [
    		{
    			"aria-current": a_aria_current_value = /*isSelected*/ ctx[1] ? "page" : undefined
    		},
    		{ href: /*href*/ ctx[2] },
    		/*$$restProps*/ ctx[4]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			toggle_class(span, "bx--side-nav__link-text", true);
    			add_location(span, file$9, 32, 4, 620);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--side-nav__link", true);
    			add_location(a, file$9, 24, 2, 444);
    			toggle_class(li, "bx--side-nav__menu-item", true);
    			add_location(li, file$9, 23, 0, 398);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, span);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span, null);
    			}

    			/*a_binding*/ ctx[8](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*text*/ 8) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*isSelected*/ 2 && a_aria_current_value !== (a_aria_current_value = /*isSelected*/ ctx[1] ? "page" : undefined)) && { "aria-current": a_aria_current_value },
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			toggle_class(a, "bx--side-nav__link", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[8](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = ["isSelected","href","text","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SideNavMenuItem", slots, ['default']);
    	let { isSelected = undefined } = $$props;
    	let { href = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("isSelected" in $$new_props) $$invalidate(1, isSelected = $$new_props.isSelected);
    		if ("href" in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ("text" in $$new_props) $$invalidate(3, text = $$new_props.text);
    		if ("ref" in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ isSelected, href, text, ref });

    	$$self.$inject_state = $$new_props => {
    		if ("isSelected" in $$props) $$invalidate(1, isSelected = $$new_props.isSelected);
    		if ("href" in $$props) $$invalidate(2, href = $$new_props.href);
    		if ("text" in $$props) $$invalidate(3, text = $$new_props.text);
    		if ("ref" in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ref,
    		isSelected,
    		href,
    		text,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		a_binding
    	];
    }

    class SideNavMenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { isSelected: 1, href: 2, text: 3, ref: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNavMenuItem",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get isSelected() {
    		throw new Error("<SideNavMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<SideNavMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<SideNavMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<SideNavMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SideNavMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SideNavMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<SideNavMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<SideNavMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\Content.svelte generated by Svelte v3.38.2 */

    const file$8 = "node_modules\\carbon-components-svelte\\src\\UIShell\\Content.svelte";

    function create_fragment$9(ctx) {
    	let main;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	let main_levels = [{ id: /*id*/ ctx[0] }, /*$$restProps*/ ctx[1]];
    	let main_data = {};

    	for (let i = 0; i < main_levels.length; i += 1) {
    		main_data = assign(main_data, main_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (default_slot) default_slot.c();
    			set_attributes(main, main_data);
    			toggle_class(main, "bx--content", true);
    			add_location(main, file$8, 5, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			set_attributes(main, main_data = get_spread_update(main_levels, [
    				(!current || dirty & /*id*/ 1) && { id: /*id*/ ctx[0] },
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
    			]));

    			toggle_class(main, "bx--content", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const omit_props_names = ["id"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Content", slots, ['default']);
    	let { id = "main-content" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("id" in $$new_props) $$invalidate(0, id = $$new_props.id);
    		if ("$$scope" in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ id });

    	$$self.$inject_state = $$new_props => {
    		if ("id" in $$props) $$invalidate(0, id = $$new_props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, $$restProps, $$scope, slots];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get id() {
    		throw new Error("<Content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\SkipToContent.svelte generated by Svelte v3.38.2 */

    const file$7 = "node_modules\\carbon-components-svelte\\src\\UIShell\\SkipToContent.svelte";

    // (16:8) Skip to main content
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Skip to main content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(16:8) Skip to main content",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ tabindex: /*tabindex*/ ctx[1] },
    		/*$$restProps*/ ctx[2]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--skip-to-content", true);
    			add_location(a, file$7, 8, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*tabindex*/ 2) && { tabindex: /*tabindex*/ ctx[1] },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));

    			toggle_class(a, "bx--skip-to-content", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","tabindex"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SkipToContent", slots, ['default']);
    	let { href = "#main-content" } = $$props;
    	let { tabindex = "0" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("href" in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ("tabindex" in $$new_props) $$invalidate(1, tabindex = $$new_props.tabindex);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ href, tabindex });

    	$$self.$inject_state = $$new_props => {
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("tabindex" in $$props) $$invalidate(1, tabindex = $$new_props.tabindex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, tabindex, $$restProps, $$scope, slots, click_handler];
    }

    class SkipToContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { href: 0, tabindex: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SkipToContent",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get href() {
    		throw new Error("<SkipToContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<SkipToContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<SkipToContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<SkipToContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\UIShell\SideNavDivider.svelte generated by Svelte v3.38.2 */

    const file$6 = "node_modules\\carbon-components-svelte\\src\\UIShell\\SideNavDivider.svelte";

    function create_fragment$7(ctx) {
    	let li;
    	let li_levels = [{ role: "separator" }, /*$$restProps*/ ctx[0]];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			set_attributes(li, li_data);
    			toggle_class(li, "bx--side-nav__divider", true);
    			add_location(li, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(li, li_data = get_spread_update(li_levels, [{ role: "separator" }, dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    			toggle_class(li, "bx--side-nav__divider", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SideNavDivider", slots, []);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    	};

    	return [$$restProps];
    }

    class SideNavDivider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideNavDivider",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    // ---------------------------------------------------------------------------
    // Constants
    // ---------------------------------------------------------------------------
    // VGUI by default scales all size and position values to these dimensions,
    // thus a width of 640 pixels effectively represents the entire screen, when
    // "proportionality" is enabled, which is by default in VGUI.
    const vguiBaseWidth = 640;
    const vguiBaseHeight = 480;
    // When parsing these values, '0's and '1's will be parsed as false and true, respectively 
    const booleanVguiPanelProperties = [
        'visible',
        'enabled',
        'proportionalToParent',
        'pin_to_sibling_corner',
        'pin_corner_to_sibling'
    ];

    const vguiResource = writable(null);
    const currentEditingVguiPanel = writable(null);
    const viewportProportions = writable({
        width: 1,
        height: 1
    });
    const enableAdaptingViewport = writable(true);
    // Forces all hidden panels to be drawn regardless of their 'visible' property.
    const showAllHidden = writable(false);
    // VGUI scales xpos, ypos, wide, and tall properties based on the window's height, which
    // is why viewportScales.width is scaled to fit the height.
    const viewportScales = derived([viewportProportions, enableAdaptingViewport], ([$viewportProportions, $enableAdaptingViewport]) => ({
        width: $enableAdaptingViewport ? ($viewportProportions.height / vguiBaseHeight) : 1,
        height: $enableAdaptingViewport ? ($viewportProportions.height / vguiBaseHeight) : 1,
    }));
    const aspectRatios = ['4 / 3', '16 / 9', '16 / 10', '2 / 1'];
    const aspectRatio = writable('4 / 3');
    const panelLabelOptions = writable({
        allPanelNames: false,
        panelName: true,
        labels: true,
    });

    const kvExample = `
"Resource/UI/Video.res"
{
	"Video"
	{
		"ControlName"		"Frame"
		"fieldName"			"Video"
		"xpos"				"0"
		"ypos"				"0"
		"wide"				"f0"
		"tall"				"448"
		"autoResize"		"0"
		"pinCorner"			"0"
		"visible"			"1"
		"enabled"			"1"
		"tabPosition"		"0"
	}
	
	"ImgBackground"	[$WIN32]
	{
		"ControlName"			"L4DMenuBackground"
		"fieldName"				"ImgBackground"
		"xpos"					"0"
		"ypos"					"79"
		"zpos"					"-1"
		"wide"					"f0"
		"tall"					"340"
		"autoResize"			"0"
		"pinCorner"				"0"
		"visible"				"1"
		"enabled"				"1"
		"tabPosition"			"0"
		"fillColor"				"0 0 0 0"
	}

	"SldBrightness"
	{
		"ControlName"			"SliderControl"
		"fieldName"				"SldBrightness"
		"xpos"					"c-205"
		"ypos"					"110"
		"zpos"					"3"
		"wide"					"410"
		"tall"					"15"
		"visible"				"1"
		"enabled"				"1"
		"IgnoreButtonA"			"1"
		"?windowed"
		{
			"visible"				"0"
			"enabled"				"0"
		}
		"usetitlesafe"			"0"
		"tabPosition"			"0"
		"minValue"				"1.8"
		"maxValue"				"2.6"
		"stepSize"				"0.05"
		"navUp"					"Btn3rdPartyCredits"
		"navDown"				"DrpAspectRatio"
		"conCommand"			"mat_monitorgamma"
		"inverseFill"			"0"

		//button and label
		"BtnDropButton"
		{
			"ControlName"			"L4D360HybridButton"
			"fieldName"				"BtnDropButton"
			"xpos"					"0"
			"ypos"					"0"
			"zpos"					"0"
			"wide"					"410"
			"wideatopen"			"260"	[$WIN32 && !$WIN32WIDE]
			"tall"					"15"
			"autoResize"			"1"
			"pinCorner"				"0"
			"visible"				"1"
			"enabled"				"1"
			"IgnoreButtonA"			"1"
			"tabPosition"			"0"
			"AllCaps"				"1"
			"labelText"				"#L4D360UI_VideoOptions_Brightness"
			"tooltiptext"			"#L4D360UI_VideoOptions_Tooltip_Brightness"
			"disabled_tooltiptext"	"#L4D360UI_VideoOptions_Tooltip_Brightness"
			"style"					"DefaultButton"
			"command"				""
			"ActivationType"		"1"
			"OnlyActiveUser"		"1"
			"usablePlayerIndex"		"nobody"
		}
	}
	
	"DrpAspectRatio"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpAspectRatio"
		"xpos"				"c-205"
		"ypos"				"130"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"1"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"SldBrightness"
		"navDown"			"DrpResolution"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#GameUI_AspectRatio"
			"tooltiptext"				"#L4D_aspect_ratio_tip"
			"style"						"DropDownButton"
			"command"					"FlmAspectRatio"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmAspectRatio"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmAspectRatio"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownAspectRatio.res"
		"OnlyActiveUser"		"1"
	}
	
	"DrpResolution"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpResolution"
		"xpos"				"c-205"
		"ypos"				"150"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"1"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"DrpAspectRatio"
		"navDown"			"DrpDisplayMode"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#GameUI_Resolution"
			"tooltiptext"				"#L4D_resolution_tip"
			"style"						"DropDownButton"
			"command"					"FlmResolution"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmResolution"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmResolution"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownResolution.res"
		"OnlyActiveUser"		"1"
	}
	
	"DrpDisplayMode"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpDisplayMode"
		"xpos"				"c-205"
		"ypos"				"170"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"1"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"DrpResolution"
		"navDown"			"SldFilmGrain"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#GameUI_DisplayMode"
			"tooltiptext"				"#L4D_display_mode_tip"
			"style"						"DropDownButton"
			"command"					"FlmDisplayMode"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmDisplayMode"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmDisplayMode"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownDisplayMode.res"
		"OnlyActiveUser"		"1"
	}
	
	"SldFilmGrain"
	{
		"ControlName"			"SliderControl"
		"fieldName"				"SldFilmGrain"
		"xpos"					"c-205"
		"ypos"					"190"
		"zpos"					"3"
		"wide"					"410"
		"tall"					"15"
		"visible"				"1"
		"enabled"				"1"
		"usetitlesafe"			"0"
		"tabPosition"			"0"
		"minValue"				"0.0"
		"maxValue"				"3.0"
		"stepSize"				"0.2"
		"navUp"					"DrpDisplayMode"
		"navDown"				"BtnAdvanced"
		"conCommand"			"mat_grain_scale_override"
		"usetitlesafe"			"0"
		"inverseFill"			"0"
		
		//button and label
		"BtnDropButton"
		{
			"ControlName"			"L4D360HybridButton"
			"fieldName"				"BtnDropButton"
			"xpos"					"0"
			"ypos"					"0"
			"zpos"					"0"
			"wide"					"410"
			"wideatopen"			"260"	[$WIN32 && !$WIN32WIDE]
			"tall"					"15"
			"autoResize"			"1"
			"pinCorner"				"0"
			"visible"				"1"
			"enabled"				"1"
			"tabPosition"			"0"
			"AllCaps"					"1"
			"labelText"				"#L4D360UI_VideoOptions_FilmGrain"
			"tooltiptext"			"#L4D360UI_VideoOptions_Tooltip_FilmGrain"	[$X360]
			"tooltiptext"			"#L4D_film_grain_tip"						[$WIN32]
			"disabled_tooltiptext"	"#L4D360UI_VideoOptions_Tooltip_FilmGrain_Disabled"
			"style"					"DefaultButton"
			"command"				""
			"ActivationType"		"1"	
			"OnlyActiveUser"		"1"
			"usablePlayerIndex"		"nobody"
		}
	}
	
	"BtnAdvanced"
	{
		"ControlName"			"L4D360HybridButton"
		"fieldName"				"BtnAdvanced"
		"xpos"					"c-205"
		"ypos"					"210"
		"zpos"					"0"
		"wide"					"260"
		"tall"					"15"
		"autoResize"			"1"
		"pinCorner"				"0"
		"visible"				"1"
		"enabled"				"1"
		"tabPosition"			"0"
		"wrap"					"1"
		"navUp"					"SldFilmGrain"
		"navDown"				"DrpAntialias"
		"AllCaps"				"1"
		"labelText"				"#L4D_advanced_settings"
		"tooltiptext"			"#L4D_advanced_settings_tip"
		"style"					"DefaultButton"
		"command"				"ShowAdvanced"
		EnabledTextInsetX		"2"
		DisabledTextInsetX		"2"
		FocusTextInsetX			"2"
		OpenTextInsetX			"2"
	}
	
	"DrpAntialias"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpAntialias"
		"xpos"				"c-205"
		"ypos"				"210"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"0"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"BtnAdvanced"
		"navDown"			"DrpFiltering"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#L4D360UI_VideoOptions_Antialiasing"
			"tooltiptext"				"#L4D_anti_alias_tip"
			"style"						"DropDownButton"
			"command"					"FlmAntialias"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmAntialias"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmAntialias"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownAntialias.res"
		"OnlyActiveUser"		"1"
	}
	
	"DrpFiltering"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpFiltering"
		"xpos"				"c-205"
		"ypos"				"230"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"0"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"DrpAntialias"
		"navDown"			"DrpVSync"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#GameUI_Filtering_Mode"
			"tooltiptext"				"#L4D_filtering_tip"
			"style"						"DropDownButton"
			"command"					"FlmFiltering"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmFiltering"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmFiltering"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownFiltering.res"
		"OnlyActiveUser"		"1"
	}
	
	"DrpVSync"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpVSync"
		"xpos"				"c-205"
		"ypos"				"250"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"0"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"DrpFiltering"
		"navDown"			"DrpShaderDetail"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#GameUI_Wait_For_VSync"
			"tooltiptext"				"#L4D_vertical_sync_tip"
			"style"						"DropDownButton"
			"command"					"FlmVSync"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmVSync"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmVSync"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownVSync.res"
		"OnlyActiveUser"		"1"
	}

	"DrpShaderDetail"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpShaderDetail"
		"xpos"				"c-205"
		"ypos"				"270"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"0"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"DrpVSync"
		"navDown"			"DrpCPUDetail"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#GameUI_Shader_Detail"
			"tooltiptext"				"#L4D_shader_detail_tip"
			"style"						"DropDownButton"
			"command"					"FlmShaderDetail"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmShaderDetail"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmShaderDetail"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownShaderDetail.res"
		"OnlyActiveUser"		"1"
	}
	
	"DrpCPUDetail"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpCPUDetail"
		"xpos"				"c-205"
		"ypos"				"290"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"0"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"DrpShaderDetail"
		"navDown"			"DrpModelDetail"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#L4D360UI_VideoOptions_CPU_Detail"
			"tooltiptext"				"#L4D_effect_detail_tip"
			"style"						"DropDownButton"
			"command"					"FlmCPUDetail"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmCPUDetail"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmCPUDetail"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownCPUDetail.res"
		"OnlyActiveUser"		"1"
	}
	
	"DrpModelDetail"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpModelDetail"
		"xpos"				"c-205"
		"ypos"				"310"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"0"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"DrpCPUDetail"
		"navDown"			"DrpQueuedMode"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#L4D360UI_VideoOptions_Model_Texture_Detail"
			"tooltiptext"				"#L4D_model_texture_tip"
			"style"						"DropDownButton"
			"command"					"FlmModelDetail"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmModelDetail"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmModelDetail"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownModelDetail.res"
		"OnlyActiveUser"		"1"
	}

	"DrpQueuedMode"
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpQueuedMode"
		"xpos"				"c-205"
		"ypos"				"330"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"0"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"DrpModelDetail"
		"navDown"			"DrpPagedPoolMem" [!$POSIX]
		"navDown"			"BtnUseRecommended" [$POSIX]
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#L4D360UI_VideoOptions_Queued_Mode"
			"tooltiptext"				"#L4D360UI_VideoOptions_Queued_Mode_Tooltip"
			"style"						"DropDownButton"
			"command"					"FlmQueuedMode"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmQueuedMode"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmQueuedMode"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOn"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownQueuedMode.res"
		"OnlyActiveUser"		"1"
	}

	"DrpPagedPoolMem" [!$POSIX]
	{
		"ControlName"		"DropDownMenu"
		"fieldName"			"DrpPagedPoolMem"
		"xpos"				"c-205"
		"ypos"				"350"
		"zpos"				"3"
		"wide"				"410"
		"tall"				"15"
		"visible"			"0"
		"enabled"			"1"
		"usetitlesafe"		"0"
		"tabPosition"		"0"
		"navUp"				"DrpModelDetail"
		"navDown"			"BtnUseRecommended"
				
		//button and label
		"BtnDropButton"
		{
			"ControlName"				"L4D360HybridButton"
			"fieldName"					"BtnDropButton"
			"xpos"						"0"
			"ypos"						"0"
			"zpos"						"0"
			"wide"						"410"
			"wideatopen"				"260"	[$WIN32 && !$WIN32WIDE]
			"tall"						"15"
			"autoResize"				"1"
			"pinCorner"					"0"
			"visible"					"1"
			"enabled"					"1"
			"tabPosition"				"1"
			"AllCaps"					"1"
			"labelText"					"#L4D360UI_VideoOptions_Paged_Pool_Mem"
			"tooltiptext"				"#L4D_paged_pool_mem_tip"
			"style"						"DropDownButton"
			"command"					"FlmPagedPoolMem"
			"ActivationType"			"1"
			"OnlyActiveUser"			"1"
		}
	}
	
	//flyouts		
	"FlmPagedPoolMem"
	{
		"ControlName"			"FlyoutMenu"
		"fieldName"				"FlmPagedPoolMem"
		"visible"				"0"
		"wide"					"0"
		"tall"					"0"
		"zpos"					"4"
		"InitialFocus"			"BtnOff"
		"ResourceFile"			"resource/UI/L4D360UI/DropDownPagedPoolMem.res"
		"OnlyActiveUser"		"1"
	}
	
	"BtnUseRecommended"
	{
		"ControlName"			"L4D360HybridButton"
		"fieldName"				"BtnUseRecommended"
		"xpos"					"c-205"
		"ypos"					"350" [$POSIX]
		"ypos"					"370" [!$POSIX]
		"zpos"					"0"
		"wide"					"280"
		"tall"					"15"
		"autoResize"			"1"
		"pinCorner"				"0"
		"visible"				"1"
		"enabled"				"1"
		"tabPosition"			"0"
		"wrap"					"1"
		"navUp"					"DrpPagedPoolMem"  [!$POSIX]
		"navUp"					"DrpQueuedMode"    [$POSIX]
		"navDown"				"BtnCancel"
		"AllCaps"				"1"
		"labelText"				"#L4D360UI_UseRecommended"
		"tooltiptext"			"#L4D360UI_UseRecommended_Tooltip"
		"style"					"DefaultButton"
		"command"				"UseRecommended"
		EnabledTextInsetX		"2"
		DisabledTextInsetX		"2"
		FocusTextInsetX			"2"
		OpenTextInsetX			"2"
	}
	
	"BtnCancel"
	{
		"ControlName"			"L4D360HybridButton"
		"fieldName"				"BtnCancel"
		"xpos"					"c-205"
		"ypos"					"370" [$POSIX]
		"ypos"					"390" [!$POSIX]
		"zpos"					"0"
		"wide"					"260"
		"tall"					"15"
		"autoResize"			"1"
		"pinCorner"				"0"
		"visible"				"1"
		"enabled"				"1"
		"tabPosition"			"0"
		"wrap"					"1"
		"navUp"					"BtnUseRecommended"
		"navDown"				"BtnDone"
		"AllCaps"				"1"
		"labelText"				"#L4D360UI_Cancel"
		"tooltiptext"			"#L4D360UI_Tooltip_Cancel"
		"style"					"DefaultButton"
		"command"				"Cancel"
		EnabledTextInsetX		"2"
		DisabledTextInsetX		"2"
		FocusTextInsetX			"2"
		OpenTextInsetX			"2"
	}
	
	"BtnDone"
	{
		"ControlName"			"L4D360HybridButton"
		"fieldName"				"BtnDone"
		"xpos"					"c-205"
		"ypos"					"390" [$POSIX]
		"ypos"					"410" [!$POSIX]
		"zpos"					"0"
		"wide"					"260"
		"tall"					"15"
		"autoResize"			"1"
		"pinCorner"				"0"
		"visible"				"1"
		"enabled"				"1"
		"tabPosition"			"0"
		"wrap"					"1"
		"navUp"					"BtnCancel"
		"navDown"				"Btn3rdPartyCredits"
		"AllCaps"				"1"
		"labelText"				"#L4D360UI_Done"
		"tooltiptext"			"#L4D360UI_Tooltip_Back"
		"style"					"RedButton"
		"command"				"Back"
		EnabledTextInsetX		"2"
		DisabledTextInsetX		"2"
		FocusTextInsetX			"2"
		OpenTextInsetX			"2"
	}
	
	"Btn3rdPartyCredits"
	{
		"ControlName"			"L4D360HybridButton"
		"fieldName"				"Btn3rdPartyCredits"
		"xpos"					"c-140"
		"ypos"					"410" [$POSIX]
		"ypos"					"430" [!$POSIX]
		"zpos"					"0"
		"wide"					"280"
		"tall"					"15"
		"autoResize"			"1"
		"pinCorner"				"0"
		"visible"				"1"
		"enabled"				"1"
		"tabPosition"			"0"
		"wrap"					"1"
		"navUp"					"BtnDone"
		"navDown"				"SldBrightness"
		"AllCaps"				"1"
		"labelText"				"#GameUI_ThirdPartyVideo_Title"
		"tooltiptext"			"#GameUI_ThirdPartyTechCredits"
		"style"					"DialogButton"
		"command"				"3rdPartyCredits"
		EnabledTextInsetX		"2"
		DisabledTextInsetX		"2"
		FocusTextInsetX			"2"
		OpenTextInsetX			"2"
	}
}
`;

    // Credit to: https://stackoverflow.com/questions/2817646/javascript-split-string-on-space-or-on-quotes-to-array
    function tokenizeKeyValueString(keyValuesString) {
        let list = [];
        let target = keyValuesString
            .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Get rid of comments
            // .replace(/ *\[[^\]]*]/g, '')                // Get rid of conditionals
            .split('{').join(' { ') // Assure spacing between some reserved keywords or symbols
            .split('}').join(' } ');
        // let regexp = /[^\s"]+|"([^"]*)"/g;
        // let conditionalRegex = /\[(.*?)\]/g;
        // RegExp that tokenizes with quotes or square brackets
        let reg2 = /(\[(.*?)\]|[^\s"]+|"([^"]*)")/g;
        do {
            //Each call to exec returns the next regex match as an array
            var match = reg2.exec(target);
            if (match != null) {
                // match[3] holds the tokenized value not surrounded in quotes
                list.push(match[3] ? match[3] : match[0]);
            }
        } while (match != null);
        return list;
    }

    // Recursively parses a tokenized list
    function parseVguiRes(tokenizedKeyValues, conditionals) {
        let parsingAt = 0;
        let parseList = tokenizedKeyValues;
        function parseVguiResRecursive(parentVguiPanel = null, skipAllFromNowOn = false) {
            // Used later for determening wether or not the currently parsed object's conditional is faulty.
            // A faulty conditional means the object won't be addded as a child to the parent
            let thisObjectDoesntMeetConditional = false;
            // Prepare an empty VGUI Panel
            let vguiPanel = {
                name: parseList[parsingAt++],
                properties: {
                    enabled: false,
                    visible: false,
                },
                children: []
            };
            // The object has an adjacent conditional
            if (parseList[parsingAt].startsWith('[')) {
                let conditional = parseList[parsingAt];
                parsingAt++;
                // We still have to parse all children so we get rid of them correctly
                if (!conditionals[conditional]) {
                    thisObjectDoesntMeetConditional = true;
                }
            }
            // Assume the next char is '{' which defines a new sub-panel
            parsingAt++;
            let token = '';
            while (true) {
                token = parseList[parsingAt];
                // This marks the end of the panel
                if (token == '}') {
                    parsingAt++;
                    break;
                }
                let tokenAdjacent = parseList[parsingAt + 1];
                // We have a new child panel
                if (tokenAdjacent == '{' || tokenAdjacent.startsWith('[')) {
                    //, skipAllFromNowOn || tokenAdjacent.startsWith('[')
                    parseVguiResRecursive(vguiPanel, skipAllFromNowOn || thisObjectDoesntMeetConditional);
                    continue;
                }
                // We have a property! 
                // The property has an adjacent conditional
                if (parseList[parsingAt + 2].startsWith('[')) {
                    let conditional = parseList[parsingAt + 2];
                    parsingAt += 3; // Skip the next 3 tokens as they'll be ignored
                    if (!conditionals[conditional]) {
                        continue;
                    }
                }
                else {
                    parsingAt += 2;
                }
                // If a conditional has been flagged as faulty, don't add the property to the object
                if (skipAllFromNowOn || thisObjectDoesntMeetConditional)
                    continue;
                if (booleanVguiPanelProperties.includes(token))
                    vguiPanel.properties[token] = (tokenAdjacent == '1');
                else
                    vguiPanel.properties[token] = tokenAdjacent;
            }
            // If a conditional has been flagged as faulty, don't add the object as a child. 
            // This implementation is a bit wack, because it still parses all child objects while knowing
            // they'll all be skipped. Hopefully they're atleast properly deleted from memory with the GC.
            if (skipAllFromNowOn || thisObjectDoesntMeetConditional)
                return null;
            // If this panel has no parent, return it as the root
            if (parentVguiPanel == null)
                return vguiPanel;
            // On the other hand, if the panel does have a parent, add it as a child panel
            parentVguiPanel.children.push(vguiPanel);
        }
        // Assing the first parsed panel as the Root panel.
        // The root panel is hidden from the resource tree!
        let rootPanel = parseVguiResRecursive();
        vguiResource.set(rootPanel);
    }
    // Tokenizes a .res string and then parses it
    function tokenizeResFileAndParseToVgui(res, conditionals) {
        parseVguiRes(tokenizeKeyValueString(res), conditionals);
    }

    /* src\components\Header.svelte generated by Svelte v3.38.2 */

    const { Object: Object_1$1, console: console_1 } = globals;
    const file$5 = "src\\components\\Header.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[23] = list;
    	child_ctx[24] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (51:4) <HeaderNavMenu text="File">
    function create_default_slot_5(ctx) {
    	let headernavitem;
    	let current;

    	headernavitem = new HeaderNavItem({
    			props: { text: "Load .res" },
    			$$inline: true
    		});

    	headernavitem.$on("click", /*click_handler*/ ctx[11]);

    	const block = {
    		c: function create() {
    			create_component(headernavitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headernavitem, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headernavitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headernavitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headernavitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(51:4) <HeaderNavMenu text=\\\"File\\\">",
    		ctx
    	});

    	return block;
    }

    // (55:4) <HeaderNavMenu text="View">
    function create_default_slot_4(ctx) {
    	let headernavitem0;
    	let t0;
    	let sidenavdivider;
    	let t1;
    	let headernavitem1;
    	let t2;
    	let headernavitem2;
    	let current;

    	headernavitem0 = new HeaderNavItem({
    			props: {
    				text: /*$showAllHidden*/ ctx[4]
    				? "Hide all hidden"
    				: "Show all hidden"
    			},
    			$$inline: true
    		});

    	headernavitem0.$on("click", /*click_handler_1*/ ctx[12]);
    	sidenavdivider = new SideNavDivider({ $$inline: true });

    	headernavitem1 = new HeaderNavItem({
    			props: {
    				text: /*$panelLabelOptions*/ ctx[5].panelName
    				? "Hide Panel Names"
    				: "Show Panel Names"
    			},
    			$$inline: true
    		});

    	headernavitem1.$on("click", /*click_handler_2*/ ctx[13]);

    	headernavitem2 = new HeaderNavItem({
    			props: {
    				text: /*$panelLabelOptions*/ ctx[5].labels
    				? "Hide Labels"
    				: "Show Labels"
    			},
    			$$inline: true
    		});

    	headernavitem2.$on("click", /*click_handler_3*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(headernavitem0.$$.fragment);
    			t0 = space();
    			create_component(sidenavdivider.$$.fragment);
    			t1 = space();
    			create_component(headernavitem1.$$.fragment);
    			t2 = space();
    			create_component(headernavitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headernavitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(sidenavdivider, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(headernavitem1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(headernavitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const headernavitem0_changes = {};

    			if (dirty & /*$showAllHidden*/ 16) headernavitem0_changes.text = /*$showAllHidden*/ ctx[4]
    			? "Hide all hidden"
    			: "Show all hidden";

    			headernavitem0.$set(headernavitem0_changes);
    			const headernavitem1_changes = {};

    			if (dirty & /*$panelLabelOptions*/ 32) headernavitem1_changes.text = /*$panelLabelOptions*/ ctx[5].panelName
    			? "Hide Panel Names"
    			: "Show Panel Names";

    			headernavitem1.$set(headernavitem1_changes);
    			const headernavitem2_changes = {};

    			if (dirty & /*$panelLabelOptions*/ 32) headernavitem2_changes.text = /*$panelLabelOptions*/ ctx[5].labels
    			? "Hide Labels"
    			: "Show Labels";

    			headernavitem2.$set(headernavitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headernavitem0.$$.fragment, local);
    			transition_in(sidenavdivider.$$.fragment, local);
    			transition_in(headernavitem1.$$.fragment, local);
    			transition_in(headernavitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headernavitem0.$$.fragment, local);
    			transition_out(sidenavdivider.$$.fragment, local);
    			transition_out(headernavitem1.$$.fragment, local);
    			transition_out(headernavitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headernavitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(sidenavdivider, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(headernavitem1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(headernavitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(55:4) <HeaderNavMenu text=\\\"View\\\">",
    		ctx
    	});

    	return block;
    }

    // (65:6) {#each aspectRatios as _ar}
    function create_each_block_1$1(ctx) {
    	let headernavitem;
    	let current;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[15](/*_ar*/ ctx[25]);
    	}

    	headernavitem = new HeaderNavItem({
    			props: { text: /*_ar*/ ctx[25] },
    			$$inline: true
    		});

    	headernavitem.$on("click", click_handler_4);

    	const block = {
    		c: function create() {
    			create_component(headernavitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headernavitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headernavitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headernavitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headernavitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(65:6) {#each aspectRatios as _ar}",
    		ctx
    	});

    	return block;
    }

    // (64:4) <HeaderNavMenu text={`Aspect Ratio: ${$aspectRatio}`}>
    function create_default_slot_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = aspectRatios;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*aspectRatios, updateAspectRatio*/ 512) {
    				each_value_1 = aspectRatios;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(64:4) <HeaderNavMenu text={`Aspect Ratio: ${$aspectRatio}`}>",
    		ctx
    	});

    	return block;
    }

    // (50:2) <HeaderNav>
    function create_default_slot_2(ctx) {
    	let headernavmenu0;
    	let t0;
    	let headernavmenu1;
    	let t1;
    	let headernavmenu2;
    	let current;

    	headernavmenu0 = new HeaderNavMenu({
    			props: {
    				text: "File",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	headernavmenu1 = new HeaderNavMenu({
    			props: {
    				text: "View",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	headernavmenu2 = new HeaderNavMenu({
    			props: {
    				text: `Aspect Ratio: ${/*$aspectRatio*/ ctx[6]}`,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(headernavmenu0.$$.fragment);
    			t0 = space();
    			create_component(headernavmenu1.$$.fragment);
    			t1 = space();
    			create_component(headernavmenu2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headernavmenu0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(headernavmenu1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(headernavmenu2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const headernavmenu0_changes = {};

    			if (dirty & /*$$scope, showLoad*/ 268435460) {
    				headernavmenu0_changes.$$scope = { dirty, ctx };
    			}

    			headernavmenu0.$set(headernavmenu0_changes);
    			const headernavmenu1_changes = {};

    			if (dirty & /*$$scope, $panelLabelOptions, $showAllHidden*/ 268435504) {
    				headernavmenu1_changes.$$scope = { dirty, ctx };
    			}

    			headernavmenu1.$set(headernavmenu1_changes);
    			const headernavmenu2_changes = {};
    			if (dirty & /*$aspectRatio*/ 64) headernavmenu2_changes.text = `Aspect Ratio: ${/*$aspectRatio*/ ctx[6]}`;

    			if (dirty & /*$$scope*/ 268435456) {
    				headernavmenu2_changes.$$scope = { dirty, ctx };
    			}

    			headernavmenu2.$set(headernavmenu2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headernavmenu0.$$.fragment, local);
    			transition_in(headernavmenu1.$$.fragment, local);
    			transition_in(headernavmenu2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headernavmenu0.$$.fragment, local);
    			transition_out(headernavmenu1.$$.fragment, local);
    			transition_out(headernavmenu2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headernavmenu0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(headernavmenu1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(headernavmenu2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(50:2) <HeaderNav>",
    		ctx
    	});

    	return block;
    }

    // (45:0) <Header company="VGUI Inspector" platformName={$vguiResource?.name}  isSideNavOpen={true}>
    function create_default_slot_1$1(ctx) {
    	let headernav;
    	let current;

    	headernav = new HeaderNav({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(headernav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headernav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const headernav_changes = {};

    			if (dirty & /*$$scope, $aspectRatio, $panelLabelOptions, $showAllHidden, showLoad*/ 268435572) {
    				headernav_changes.$$scope = { dirty, ctx };
    			}

    			headernav.$set(headernav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headernav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headernav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headernav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(45:0) <Header company=\\\"VGUI Inspector\\\" platformName={$vguiResource?.name}  isSideNavOpen={true}>",
    		ctx
    	});

    	return block;
    }

    // (46:2) 
    function create_skip_to_content_slot(ctx) {
    	let div;
    	let skiptocontent;
    	let current;
    	skiptocontent = new SkipToContent({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(skiptocontent.$$.fragment);
    			attr_dev(div, "slot", "skip-to-content");
    			add_location(div, file$5, 45, 2, 1645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(skiptocontent, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skiptocontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skiptocontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(skiptocontent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_skip_to_content_slot.name,
    		type: "slot",
    		source: "(46:2) ",
    		ctx
    	});

    	return block;
    }

    // (90:6) {#each (Object.keys(conditionals)) as _conditional, i}
    function create_each_block$3(ctx) {
    	let checkbox;
    	let updating_checked;
    	let current;

    	function checkbox_checked_binding(value) {
    		/*checkbox_checked_binding*/ ctx[17](value, /*_conditional*/ ctx[22]);
    	}

    	let checkbox_props = { labelText: /*_conditional*/ ctx[22] };

    	if (/*conditionals*/ ctx[1][/*_conditional*/ ctx[22]] !== void 0) {
    		checkbox_props.checked = /*conditionals*/ ctx[1][/*_conditional*/ ctx[22]];
    	}

    	checkbox = new Checkbox({ props: checkbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(checkbox, "checked", checkbox_checked_binding));

    	const block = {
    		c: function create() {
    			create_component(checkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkbox, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const checkbox_changes = {};
    			if (dirty & /*conditionals*/ 2) checkbox_changes.labelText = /*_conditional*/ ctx[22];

    			if (!updating_checked && dirty & /*conditionals, Object*/ 2) {
    				updating_checked = true;
    				checkbox_changes.checked = /*conditionals*/ ctx[1][/*_conditional*/ ctx[22]];
    				add_flush_callback(() => updating_checked = false);
    			}

    			checkbox.$set(checkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(checkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(90:6) {#each (Object.keys(conditionals)) as _conditional, i}",
    		ctx
    	});

    	return block;
    }

    // (76:0) <Modal    size="lg"    bind:open={showLoad}    modalHeading="Load VGUI Resource"    primaryButtonText="Load"    secondaryButtonText="Cancel"    on:click:button--secondary={() => (showLoad = false)}    on:submit={() => submitLoad()}  >
    function create_default_slot$3(ctx) {
    	let div1;
    	let textarea;
    	let updating_value;
    	let t0;
    	let div0;
    	let p;
    	let t2;
    	let current;

    	function textarea_value_binding(value) {
    		/*textarea_value_binding*/ ctx[16](value);
    	}

    	let textarea_props = {
    		style: "min-height: 400px",
    		labelText: "VGUI Resource"
    	};

    	if (/*loadValue*/ ctx[0] !== void 0) {
    		textarea_props.value = /*loadValue*/ ctx[0];
    	}

    	textarea = new TextArea({ props: textarea_props, $$inline: true });
    	binding_callbacks.push(() => bind(textarea, "value", textarea_value_binding));
    	let each_value = Object.keys(/*conditionals*/ ctx[1]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(textarea.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "Conditionals";
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(p, file$5, 88, 6, 3169);
    			attr_dev(div0, "class", "conditionals svelte-jqwoqo");
    			add_location(div0, file$5, 87, 4, 3135);
    			attr_dev(div1, "class", "import-res-root svelte-jqwoqo");
    			add_location(div1, file$5, 84, 2, 3004);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(textarea, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(div0, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textarea_changes = {};

    			if (!updating_value && dirty & /*loadValue*/ 1) {
    				updating_value = true;
    				textarea_changes.value = /*loadValue*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			textarea.$set(textarea_changes);

    			if (dirty & /*Object, conditionals*/ 2) {
    				each_value = Object.keys(/*conditionals*/ ctx[1]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textarea.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textarea.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(textarea);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(76:0) <Modal    size=\\\"lg\\\"    bind:open={showLoad}    modalHeading=\\\"Load VGUI Resource\\\"    primaryButtonText=\\\"Load\\\"    secondaryButtonText=\\\"Cancel\\\"    on:click:button--secondary={() => (showLoad = false)}    on:submit={() => submitLoad()}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let header;
    	let t;
    	let modal;
    	let updating_open;
    	let current;

    	header = new Header({
    			props: {
    				company: "VGUI Inspector",
    				platformName: /*$vguiResource*/ ctx[3]?.name,
    				isSideNavOpen: true,
    				$$slots: {
    					"skip-to-content": [create_skip_to_content_slot],
    					default: [create_default_slot_1$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function modal_open_binding(value) {
    		/*modal_open_binding*/ ctx[18](value);
    	}

    	let modal_props = {
    		size: "lg",
    		modalHeading: "Load VGUI Resource",
    		primaryButtonText: "Load",
    		secondaryButtonText: "Cancel",
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	if (/*showLoad*/ ctx[2] !== void 0) {
    		modal_props.open = /*showLoad*/ ctx[2];
    	}

    	modal = new Modal({ props: modal_props, $$inline: true });
    	binding_callbacks.push(() => bind(modal, "open", modal_open_binding));
    	modal.$on("click:button--secondary", /*click_button_secondary_handler*/ ctx[19]);
    	modal.$on("submit", /*submit_handler*/ ctx[20]);

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*$vguiResource*/ 8) header_changes.platformName = /*$vguiResource*/ ctx[3]?.name;

    			if (dirty & /*$$scope, $aspectRatio, $panelLabelOptions, $showAllHidden, showLoad*/ 268435572) {
    				header_changes.$$scope = { dirty, ctx };
    			}

    			header.$set(header_changes);
    			const modal_changes = {};

    			if (dirty & /*$$scope, conditionals, loadValue*/ 268435459) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty & /*showLoad*/ 4) {
    				updating_open = true;
    				modal_changes.open = /*showLoad*/ ctx[2];
    				add_flush_callback(() => updating_open = false);
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let conditionals;
    	let $vguiResource;
    	let $showAllHidden;
    	let $panelLabelOptions;
    	let $aspectRatio;
    	validate_store(vguiResource, "vguiResource");
    	component_subscribe($$self, vguiResource, $$value => $$invalidate(3, $vguiResource = $$value));
    	validate_store(showAllHidden, "showAllHidden");
    	component_subscribe($$self, showAllHidden, $$value => $$invalidate(4, $showAllHidden = $$value));
    	validate_store(panelLabelOptions, "panelLabelOptions");
    	component_subscribe($$self, panelLabelOptions, $$value => $$invalidate(5, $panelLabelOptions = $$value));
    	validate_store(aspectRatio, "aspectRatio");
    	component_subscribe($$self, aspectRatio, $$value => $$invalidate(6, $aspectRatio = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	
    	let showLoad = false;
    	let loadValue = kvExample;

    	function submitLoad() {
    		$$invalidate(2, showLoad = false);
    		tokenizeResFileAndParseToVgui(loadValue, conditionals);
    	}

    	// TODO: Remove all traces of adaptive viewport?
    	function toggleAdaptiveViewport() {
    		enableAdaptingViewport.update(_old => !_old);
    	}

    	function toggleShowAllHidden() {
    		showAllHidden.update(_old => !_old);
    	}

    	function updateAspectRatio(value) {
    		aspectRatio.set(value);
    	}

    	function TogglePanelLabelOption(option) {
    		panelLabelOptions.update(_old => {
    			let copy = Object.assign({}, _old);
    			copy[option] = !copy[option];
    			return copy;
    		});
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, showLoad = true);
    	const click_handler_1 = () => toggleShowAllHidden();
    	const click_handler_2 = () => TogglePanelLabelOption("panelName");
    	const click_handler_3 = () => TogglePanelLabelOption("labels");
    	const click_handler_4 = _ar => updateAspectRatio(_ar);

    	function textarea_value_binding(value) {
    		loadValue = value;
    		$$invalidate(0, loadValue);
    	}

    	function checkbox_checked_binding(value, _conditional) {
    		if ($$self.$$.not_equal(conditionals[_conditional], value)) {
    			conditionals[_conditional] = value;
    			($$invalidate(1, conditionals), $$invalidate(0, loadValue));
    		}
    	}

    	function modal_open_binding(value) {
    		showLoad = value;
    		$$invalidate(2, showLoad);
    	}

    	const click_button_secondary_handler = () => $$invalidate(2, showLoad = false);
    	const submit_handler = () => submitLoad();

    	$$self.$capture_state = () => ({
    		Header,
    		HeaderNav,
    		HeaderNavItem,
    		HeaderNavMenu,
    		SkipToContent,
    		Modal,
    		TextArea,
    		SideNavDivider,
    		Checkbox,
    		aspectRatio,
    		aspectRatios,
    		enableAdaptingViewport,
    		panelLabelOptions,
    		showAllHidden,
    		vguiResource,
    		kvExample,
    		tokenizeResFileAndParseToVgui,
    		showLoad,
    		loadValue,
    		submitLoad,
    		toggleAdaptiveViewport,
    		toggleShowAllHidden,
    		updateAspectRatio,
    		TogglePanelLabelOption,
    		conditionals,
    		$vguiResource,
    		$showAllHidden,
    		$panelLabelOptions,
    		$aspectRatio
    	});

    	$$self.$inject_state = $$props => {
    		if ("showLoad" in $$props) $$invalidate(2, showLoad = $$props.showLoad);
    		if ("loadValue" in $$props) $$invalidate(0, loadValue = $$props.loadValue);
    		if ("conditionals" in $$props) $$invalidate(1, conditionals = $$props.conditionals);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*loadValue*/ 1) {
    			// Gather a list of all conditionals within the RES file
    			// TODO: This implementation is poo. Improve it?
    			$$invalidate(1, conditionals = (() => {
    				var _a;

    				let allMatches = (_a = loadValue.match(/\[(.*?)\]/g)) !== null && _a !== void 0
    				? _a
    				: [];

    				let temp = {};

    				for (let _conditional of allMatches) {
    					if (!temp[_conditional]) {
    						temp[_conditional] = true;
    					}
    				}

    				return temp;
    			})());
    		}

    		if ($$self.$$.dirty & /*conditionals*/ 2) {
    			console.log(conditionals);
    		}
    	};

    	return [
    		loadValue,
    		conditionals,
    		showLoad,
    		$vguiResource,
    		$showAllHidden,
    		$panelLabelOptions,
    		$aspectRatio,
    		submitLoad,
    		toggleShowAllHidden,
    		updateAspectRatio,
    		TogglePanelLabelOption,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		textarea_value_binding,
    		checkbox_checked_binding,
    		modal_open_binding,
    		click_button_secondary_handler,
    		submit_handler
    	];
    }

    class Header_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header_1",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\ResourceTreePanel.svelte generated by Svelte v3.38.2 */
    const file$4 = "src\\components\\ResourceTreePanel.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (11:0) {#if panel.children.length == 0}
    function create_if_block_2(ctx) {
    	let sidenavlink;
    	let current;

    	sidenavlink = new SideNavLink({
    			props: { text: /*panel*/ ctx[0].name },
    			$$inline: true
    		});

    	sidenavlink.$on("click", /*click_handler*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(sidenavlink.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidenavlink, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sidenavlink_changes = {};
    			if (dirty & /*panel*/ 1) sidenavlink_changes.text = /*panel*/ ctx[0].name;
    			sidenavlink.$set(sidenavlink_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenavlink.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenavlink.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidenavlink, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(11:0) {#if panel.children.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#if panel.children.length > 0}
    function create_if_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*root*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(15:0) {#if panel.children.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (25:2) {:else}
    function create_else_block(ctx) {
    	let div;
    	let current;
    	let each_value_1 = /*panel*/ ctx[0].children;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div, "background-color", "#0000001F");
    			add_location(div, file$4, 25, 4, 835);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*panel*/ 1) {
    				each_value_1 = /*panel*/ ctx[0].children;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(25:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if !root}
    function create_if_block_1$1(ctx) {
    	let sidenavmenuitem;
    	let t;
    	let sidenavmenu;
    	let current;

    	sidenavmenuitem = new SideNavMenuItem({
    			props: { text: /*panel*/ ctx[0].name },
    			$$inline: true
    		});

    	sidenavmenuitem.$on("click", /*click_handler_1*/ ctx[4]);

    	sidenavmenu = new SideNavMenu({
    			props: {
    				text: /*panel*/ ctx[0].name + " children",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidenavmenuitem.$$.fragment);
    			t = space();
    			create_component(sidenavmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidenavmenuitem, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(sidenavmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sidenavmenuitem_changes = {};
    			if (dirty & /*panel*/ 1) sidenavmenuitem_changes.text = /*panel*/ ctx[0].name;
    			sidenavmenuitem.$set(sidenavmenuitem_changes);
    			const sidenavmenu_changes = {};
    			if (dirty & /*panel*/ 1) sidenavmenu_changes.text = /*panel*/ ctx[0].name + " children";

    			if (dirty & /*$$scope, panel*/ 1025) {
    				sidenavmenu_changes.$$scope = { dirty, ctx };
    			}

    			sidenavmenu.$set(sidenavmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenavmenuitem.$$.fragment, local);
    			transition_in(sidenavmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenavmenuitem.$$.fragment, local);
    			transition_out(sidenavmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidenavmenuitem, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(sidenavmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(16:2) {#if !root}",
    		ctx
    	});

    	return block;
    }

    // (27:6) {#each panel.children as child}
    function create_each_block_1(ctx) {
    	let resourcetreepanel;
    	let current;

    	resourcetreepanel = new ResourceTreePanel({
    			props: { panel: /*child*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(resourcetreepanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(resourcetreepanel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const resourcetreepanel_changes = {};
    			if (dirty & /*panel*/ 1) resourcetreepanel_changes.panel = /*child*/ ctx[5];
    			resourcetreepanel.$set(resourcetreepanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(resourcetreepanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(resourcetreepanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(resourcetreepanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(27:6) {#each panel.children as child}",
    		ctx
    	});

    	return block;
    }

    // (20:8) {#each panel.children as child}
    function create_each_block$2(ctx) {
    	let resourcetreepanel;
    	let current;

    	resourcetreepanel = new ResourceTreePanel({
    			props: { panel: /*child*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(resourcetreepanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(resourcetreepanel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const resourcetreepanel_changes = {};
    			if (dirty & /*panel*/ 1) resourcetreepanel_changes.panel = /*child*/ ctx[5];
    			resourcetreepanel.$set(resourcetreepanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(resourcetreepanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(resourcetreepanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(resourcetreepanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(20:8) {#each panel.children as child}",
    		ctx
    	});

    	return block;
    }

    // (18:4) <SideNavMenu text={panel.name + ' children'}>
    function create_default_slot$2(ctx) {
    	let div;
    	let current;
    	let each_value = /*panel*/ ctx[0].children;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div, "background-color", "#0000001F");
    			add_location(div, file$4, 18, 6, 640);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*panel*/ 1) {
    				each_value = /*panel*/ ctx[0].children;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(18:4) <SideNavMenu text={panel.name + ' children'}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*panel*/ ctx[0].children.length == 0 && create_if_block_2(ctx);
    	let if_block1 = /*panel*/ ctx[0].children.length > 0 && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*panel*/ ctx[0].children.length == 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*panel*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*panel*/ ctx[0].children.length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*panel*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ResourceTreePanel", slots, []);
    	
    	let { panel } = $$props;
    	let { root = false } = $$props;

    	function setCurrentEditingVguiPanel() {
    		currentEditingVguiPanel.set(panel);
    	}

    	const writable_props = ["panel", "root"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ResourceTreePanel> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setCurrentEditingVguiPanel();
    	const click_handler_1 = () => setCurrentEditingVguiPanel();

    	$$self.$$set = $$props => {
    		if ("panel" in $$props) $$invalidate(0, panel = $$props.panel);
    		if ("root" in $$props) $$invalidate(1, root = $$props.root);
    	};

    	$$self.$capture_state = () => ({
    		SideNavMenu,
    		SideNavMenuItem,
    		SideNavLink,
    		currentEditingVguiPanel,
    		panel,
    		root,
    		setCurrentEditingVguiPanel
    	});

    	$$self.$inject_state = $$props => {
    		if ("panel" in $$props) $$invalidate(0, panel = $$props.panel);
    		if ("root" in $$props) $$invalidate(1, root = $$props.root);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [panel, root, setCurrentEditingVguiPanel, click_handler, click_handler_1];
    }

    class ResourceTreePanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { panel: 0, root: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResourceTreePanel",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*panel*/ ctx[0] === undefined && !("panel" in props)) {
    			console.warn("<ResourceTreePanel> was created without expected prop 'panel'");
    		}
    	}

    	get panel() {
    		throw new Error("<ResourceTreePanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set panel(value) {
    		throw new Error("<ResourceTreePanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get root() {
    		throw new Error("<ResourceTreePanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set root(value) {
    		throw new Error("<ResourceTreePanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ResourceTree.svelte generated by Svelte v3.38.2 */
    const file$3 = "src\\components\\ResourceTree.svelte";

    // (10:6) {#if $vguiResource != null}
    function create_if_block$3(ctx) {
    	let resourcetreepanel;
    	let current;

    	resourcetreepanel = new ResourceTreePanel({
    			props: {
    				panel: /*$vguiResource*/ ctx[0],
    				root: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(resourcetreepanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(resourcetreepanel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const resourcetreepanel_changes = {};
    			if (dirty & /*$vguiResource*/ 1) resourcetreepanel_changes.panel = /*$vguiResource*/ ctx[0];
    			resourcetreepanel.$set(resourcetreepanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(resourcetreepanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(resourcetreepanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(resourcetreepanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(10:6) {#if $vguiResource != null}",
    		ctx
    	});

    	return block;
    }

    // (7:2) <SideNavItems>
    function create_default_slot_1(ctx) {
    	let div;
    	let current;
    	let if_block = /*$vguiResource*/ ctx[0] != null && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "root svelte-emat6e");
    			add_location(div, file$3, 7, 4, 446);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$vguiResource*/ ctx[0] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$vguiResource*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(7:2) <SideNavItems>",
    		ctx
    	});

    	return block;
    }

    // (6:0) <SideNav style="background-color: #0d0d0d;" isOpen={true}>
    function create_default_slot$1(ctx) {
    	let sidenavitems;
    	let current;

    	sidenavitems = new SideNavItems({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidenavitems.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidenavitems, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sidenavitems_changes = {};

    			if (dirty & /*$$scope, $vguiResource*/ 3) {
    				sidenavitems_changes.$$scope = { dirty, ctx };
    			}

    			sidenavitems.$set(sidenavitems_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenavitems.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenavitems.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidenavitems, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(6:0) <SideNav style=\\\"background-color: #0d0d0d;\\\" isOpen={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let sidenav;
    	let current;

    	sidenav = new SideNav({
    			props: {
    				style: "background-color: #0d0d0d;",
    				isOpen: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sidenav.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(sidenav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sidenav_changes = {};

    			if (dirty & /*$$scope, $vguiResource*/ 3) {
    				sidenav_changes.$$scope = { dirty, ctx };
    			}

    			sidenav.$set(sidenav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidenav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidenav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sidenav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $vguiResource;
    	validate_store(vguiResource, "vguiResource");
    	component_subscribe($$self, vguiResource, $$value => $$invalidate(0, $vguiResource = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ResourceTree", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ResourceTree> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		HeaderNav,
    		HeaderNavItem,
    		HeaderNavMenu,
    		SideNav,
    		SideNavItems,
    		SideNavMenu,
    		SideNavMenuItem,
    		SideNavLink,
    		SideNavDivider,
    		SkipToContent,
    		Content,
    		Grid,
    		Row,
    		Column,
    		vguiResource,
    		ResourceTreePanel,
    		$vguiResource
    	});

    	return [$vguiResource];
    }

    class ResourceTree extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResourceTree",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\VguiPanelProperties.svelte generated by Svelte v3.38.2 */

    const { Object: Object_1 } = globals;
    const file$2 = "src\\components\\VguiPanelProperties.svelte";

    // (12:4) {#if $currentEditingVguiPanel != null}
    function create_if_block$2(ctx) {
    	let t0;
    	let textinput0;
    	let updating_value;
    	let t1;
    	let textinput1;
    	let updating_value_1;
    	let t2;
    	let textinput2;
    	let updating_value_2;
    	let t3;
    	let toggle;
    	let updating_toggled;
    	let t4;
    	let textinput3;
    	let updating_value_3;
    	let t5;
    	let textinput4;
    	let updating_value_4;
    	let t6;
    	let textinput5;
    	let updating_value_5;
    	let t7;
    	let textinput6;
    	let updating_value_6;
    	let current;

    	function textinput0_value_binding(value) {
    		/*textinput0_value_binding*/ ctx[1](value);
    	}

    	let textinput0_props = {
    		size: "sm",
    		labelText: "Panel Name",
    		placeholder: ""
    	};

    	if (/*$currentEditingVguiPanel*/ ctx[0].name !== void 0) {
    		textinput0_props.value = /*$currentEditingVguiPanel*/ ctx[0].name;
    	}

    	textinput0 = new TextInput({ props: textinput0_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput0, "value", textinput0_value_binding));

    	function textinput1_value_binding(value) {
    		/*textinput1_value_binding*/ ctx[2](value);
    	}

    	let textinput1_props = {
    		size: "sm",
    		labelText: "ControlName",
    		placeholder: ""
    	};

    	if (/*$currentEditingVguiPanel*/ ctx[0].properties.ControlName !== void 0) {
    		textinput1_props.value = /*$currentEditingVguiPanel*/ ctx[0].properties.ControlName;
    	}

    	textinput1 = new TextInput({ props: textinput1_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput1, "value", textinput1_value_binding));

    	function textinput2_value_binding(value) {
    		/*textinput2_value_binding*/ ctx[3](value);
    	}

    	let textinput2_props = {
    		size: "sm",
    		labelText: "fieldName",
    		placeholder: ""
    	};

    	if (/*$currentEditingVguiPanel*/ ctx[0].properties.fieldName !== void 0) {
    		textinput2_props.value = /*$currentEditingVguiPanel*/ ctx[0].properties.fieldName;
    	}

    	textinput2 = new TextInput({ props: textinput2_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput2, "value", textinput2_value_binding));

    	function toggle_toggled_binding(value) {
    		/*toggle_toggled_binding*/ ctx[4](value);
    	}

    	let toggle_props = {
    		size: "sm",
    		labelText: "Visible",
    		placeholder: ""
    	};

    	if (/*$currentEditingVguiPanel*/ ctx[0].properties.visible !== void 0) {
    		toggle_props.toggled = /*$currentEditingVguiPanel*/ ctx[0].properties.visible;
    	}

    	toggle = new Toggle({ props: toggle_props, $$inline: true });
    	binding_callbacks.push(() => bind(toggle, "toggled", toggle_toggled_binding));

    	function textinput3_value_binding(value) {
    		/*textinput3_value_binding*/ ctx[5](value);
    	}

    	let textinput3_props = {
    		size: "sm",
    		labelText: "Wide",
    		placeholder: ""
    	};

    	if (/*$currentEditingVguiPanel*/ ctx[0].properties.wide !== void 0) {
    		textinput3_props.value = /*$currentEditingVguiPanel*/ ctx[0].properties.wide;
    	}

    	textinput3 = new TextInput({ props: textinput3_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput3, "value", textinput3_value_binding));

    	function textinput4_value_binding(value) {
    		/*textinput4_value_binding*/ ctx[6](value);
    	}

    	let textinput4_props = {
    		size: "sm",
    		labelText: "Tall",
    		placeholder: ""
    	};

    	if (/*$currentEditingVguiPanel*/ ctx[0].properties.tall !== void 0) {
    		textinput4_props.value = /*$currentEditingVguiPanel*/ ctx[0].properties.tall;
    	}

    	textinput4 = new TextInput({ props: textinput4_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput4, "value", textinput4_value_binding));

    	function textinput5_value_binding(value) {
    		/*textinput5_value_binding*/ ctx[7](value);
    	}

    	let textinput5_props = {
    		size: "sm",
    		labelText: "X Position",
    		placeholder: ""
    	};

    	if (/*$currentEditingVguiPanel*/ ctx[0].properties.xpos !== void 0) {
    		textinput5_props.value = /*$currentEditingVguiPanel*/ ctx[0].properties.xpos;
    	}

    	textinput5 = new TextInput({ props: textinput5_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput5, "value", textinput5_value_binding));

    	function textinput6_value_binding(value) {
    		/*textinput6_value_binding*/ ctx[8](value);
    	}

    	let textinput6_props = {
    		size: "sm",
    		labelText: "Y Position",
    		placeholder: ""
    	};

    	if (/*$currentEditingVguiPanel*/ ctx[0].properties.ypos !== void 0) {
    		textinput6_props.value = /*$currentEditingVguiPanel*/ ctx[0].properties.ypos;
    	}

    	textinput6 = new TextInput({ props: textinput6_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput6, "value", textinput6_value_binding));

    	const block = {
    		c: function create() {
    			t0 = space();
    			create_component(textinput0.$$.fragment);
    			t1 = space();
    			create_component(textinput1.$$.fragment);
    			t2 = space();
    			create_component(textinput2.$$.fragment);
    			t3 = space();
    			create_component(toggle.$$.fragment);
    			t4 = space();
    			create_component(textinput3.$$.fragment);
    			t5 = space();
    			create_component(textinput4.$$.fragment);
    			t6 = space();
    			create_component(textinput5.$$.fragment);
    			t7 = space();
    			create_component(textinput6.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			mount_component(textinput0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(textinput1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(textinput2, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(toggle, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(textinput3, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(textinput4, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(textinput5, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(textinput6, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textinput0_changes = {};

    			if (!updating_value && dirty & /*$currentEditingVguiPanel*/ 1) {
    				updating_value = true;
    				textinput0_changes.value = /*$currentEditingVguiPanel*/ ctx[0].name;
    				add_flush_callback(() => updating_value = false);
    			}

    			textinput0.$set(textinput0_changes);
    			const textinput1_changes = {};

    			if (!updating_value_1 && dirty & /*$currentEditingVguiPanel*/ 1) {
    				updating_value_1 = true;
    				textinput1_changes.value = /*$currentEditingVguiPanel*/ ctx[0].properties.ControlName;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			textinput1.$set(textinput1_changes);
    			const textinput2_changes = {};

    			if (!updating_value_2 && dirty & /*$currentEditingVguiPanel*/ 1) {
    				updating_value_2 = true;
    				textinput2_changes.value = /*$currentEditingVguiPanel*/ ctx[0].properties.fieldName;
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			textinput2.$set(textinput2_changes);
    			const toggle_changes = {};

    			if (!updating_toggled && dirty & /*$currentEditingVguiPanel*/ 1) {
    				updating_toggled = true;
    				toggle_changes.toggled = /*$currentEditingVguiPanel*/ ctx[0].properties.visible;
    				add_flush_callback(() => updating_toggled = false);
    			}

    			toggle.$set(toggle_changes);
    			const textinput3_changes = {};

    			if (!updating_value_3 && dirty & /*$currentEditingVguiPanel*/ 1) {
    				updating_value_3 = true;
    				textinput3_changes.value = /*$currentEditingVguiPanel*/ ctx[0].properties.wide;
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			textinput3.$set(textinput3_changes);
    			const textinput4_changes = {};

    			if (!updating_value_4 && dirty & /*$currentEditingVguiPanel*/ 1) {
    				updating_value_4 = true;
    				textinput4_changes.value = /*$currentEditingVguiPanel*/ ctx[0].properties.tall;
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			textinput4.$set(textinput4_changes);
    			const textinput5_changes = {};

    			if (!updating_value_5 && dirty & /*$currentEditingVguiPanel*/ 1) {
    				updating_value_5 = true;
    				textinput5_changes.value = /*$currentEditingVguiPanel*/ ctx[0].properties.xpos;
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			textinput5.$set(textinput5_changes);
    			const textinput6_changes = {};

    			if (!updating_value_6 && dirty & /*$currentEditingVguiPanel*/ 1) {
    				updating_value_6 = true;
    				textinput6_changes.value = /*$currentEditingVguiPanel*/ ctx[0].properties.ypos;
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			textinput6.$set(textinput6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput0.$$.fragment, local);
    			transition_in(textinput1.$$.fragment, local);
    			transition_in(textinput2.$$.fragment, local);
    			transition_in(toggle.$$.fragment, local);
    			transition_in(textinput3.$$.fragment, local);
    			transition_in(textinput4.$$.fragment, local);
    			transition_in(textinput5.$$.fragment, local);
    			transition_in(textinput6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput0.$$.fragment, local);
    			transition_out(textinput1.$$.fragment, local);
    			transition_out(textinput2.$$.fragment, local);
    			transition_out(toggle.$$.fragment, local);
    			transition_out(textinput3.$$.fragment, local);
    			transition_out(textinput4.$$.fragment, local);
    			transition_out(textinput5.$$.fragment, local);
    			transition_out(textinput6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			destroy_component(textinput0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(textinput1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(textinput2, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(toggle, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(textinput3, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(textinput4, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(textinput5, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(textinput6, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(12:4) {#if $currentEditingVguiPanel != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let if_block = /*$currentEditingVguiPanel*/ ctx[0] != null && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "controls svelte-1n5ih7h");
    			add_location(div0, file$2, 10, 2, 332);
    			attr_dev(div1, "class", "root svelte-1n5ih7h");
    			add_location(div1, file$2, 9, 0, 309);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$currentEditingVguiPanel*/ ctx[0] != null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$currentEditingVguiPanel*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $currentEditingVguiPanel;
    	validate_store(currentEditingVguiPanel, "currentEditingVguiPanel");
    	component_subscribe($$self, currentEditingVguiPanel, $$value => $$invalidate(0, $currentEditingVguiPanel = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("VguiPanelProperties", slots, []);
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<VguiPanelProperties> was created with unknown prop '${key}'`);
    	});

    	function textinput0_value_binding(value) {
    		if ($$self.$$.not_equal($currentEditingVguiPanel.name, value)) {
    			$currentEditingVguiPanel.name = value;
    			currentEditingVguiPanel.set($currentEditingVguiPanel);
    		}
    	}

    	function textinput1_value_binding(value) {
    		if ($$self.$$.not_equal($currentEditingVguiPanel.properties.ControlName, value)) {
    			$currentEditingVguiPanel.properties.ControlName = value;
    			currentEditingVguiPanel.set($currentEditingVguiPanel);
    		}
    	}

    	function textinput2_value_binding(value) {
    		if ($$self.$$.not_equal($currentEditingVguiPanel.properties.fieldName, value)) {
    			$currentEditingVguiPanel.properties.fieldName = value;
    			currentEditingVguiPanel.set($currentEditingVguiPanel);
    		}
    	}

    	function toggle_toggled_binding(value) {
    		if ($$self.$$.not_equal($currentEditingVguiPanel.properties.visible, value)) {
    			$currentEditingVguiPanel.properties.visible = value;
    			currentEditingVguiPanel.set($currentEditingVguiPanel);
    		}
    	}

    	function textinput3_value_binding(value) {
    		if ($$self.$$.not_equal($currentEditingVguiPanel.properties.wide, value)) {
    			$currentEditingVguiPanel.properties.wide = value;
    			currentEditingVguiPanel.set($currentEditingVguiPanel);
    		}
    	}

    	function textinput4_value_binding(value) {
    		if ($$self.$$.not_equal($currentEditingVguiPanel.properties.tall, value)) {
    			$currentEditingVguiPanel.properties.tall = value;
    			currentEditingVguiPanel.set($currentEditingVguiPanel);
    		}
    	}

    	function textinput5_value_binding(value) {
    		if ($$self.$$.not_equal($currentEditingVguiPanel.properties.xpos, value)) {
    			$currentEditingVguiPanel.properties.xpos = value;
    			currentEditingVguiPanel.set($currentEditingVguiPanel);
    		}
    	}

    	function textinput6_value_binding(value) {
    		if ($$self.$$.not_equal($currentEditingVguiPanel.properties.ypos, value)) {
    			$currentEditingVguiPanel.properties.ypos = value;
    			currentEditingVguiPanel.set($currentEditingVguiPanel);
    		}
    	}

    	$$self.$capture_state = () => ({
    		TextInput,
    		Toggle,
    		currentEditingVguiPanel,
    		vguiResource,
    		$currentEditingVguiPanel
    	});

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$currentEditingVguiPanel*/ 1) {
    			// This hack makes the entire structure update correctly
    			{
    				vguiResource.update(old => old);
    			}
    		}
    	};

    	return [
    		$currentEditingVguiPanel,
    		textinput0_value_binding,
    		textinput1_value_binding,
    		textinput2_value_binding,
    		toggle_toggled_binding,
    		textinput3_value_binding,
    		textinput4_value_binding,
    		textinput5_value_binding,
    		textinput6_value_binding
    	];
    }

    class VguiPanelProperties extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VguiPanelProperties",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\VguiPanel.svelte generated by Svelte v3.38.2 */

    const file$1 = "src\\components\\VguiPanel.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (89:0) {#if panel.properties.visible || $showAllHidden }
    function create_if_block$1(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*panel*/ ctx[0].children.length == 0 && create_if_block_1(ctx);
    	let each_value = /*panel*/ ctx[0].children;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "panel svelte-14pp5ko");
    			attr_dev(div, "style", /*panelStyle*/ ctx[1]);
    			toggle_class(div, "highlight", /*highlight*/ ctx[2]);
    			add_location(div, file$1, 89, 2, 4206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*panel*/ ctx[0].children.length == 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*panel*/ 1) {
    				each_value = /*panel*/ ctx[0].children;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*panelStyle*/ 2) {
    				attr_dev(div, "style", /*panelStyle*/ ctx[1]);
    			}

    			if (dirty & /*highlight*/ 4) {
    				toggle_class(div, "highlight", /*highlight*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(89:0) {#if panel.properties.visible || $showAllHidden }",
    		ctx
    	});

    	return block;
    }

    // (91:4) {#if panel.children.length == 0 }
    function create_if_block_1(ctx) {
    	let div;

    	let t_value = (/*hasLabel*/ ctx[3] || (/button|label/).test(/*panel*/ ctx[0]?.properties?.ControlName?.toLowerCase())
    	? /*$panelLabelOptions*/ ctx[5].labels
    		? /*hasLabel*/ ctx[3]
    			? /*panel*/ ctx[0]?.properties?.labelText
    			: /*panel*/ ctx[0]?.properties?.fieldName
    		: ""
    	: /*$panelLabelOptions*/ ctx[5].panelName
    		? /*panel*/ ctx[0]?.properties?.fieldName
    		: "") + "";

    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "name svelte-14pp5ko");
    			add_location(div, file$1, 91, 6, 4355);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hasLabel, panel, $panelLabelOptions*/ 41 && t_value !== (t_value = (/*hasLabel*/ ctx[3] || (/button|label/).test(/*panel*/ ctx[0]?.properties?.ControlName?.toLowerCase())
    			? /*$panelLabelOptions*/ ctx[5].labels
    				? /*hasLabel*/ ctx[3]
    					? /*panel*/ ctx[0]?.properties?.labelText
    					: /*panel*/ ctx[0]?.properties?.fieldName
    				: ""
    			: /*$panelLabelOptions*/ ctx[5].panelName
    				? /*panel*/ ctx[0]?.properties?.fieldName
    				: "") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(91:4) {#if panel.children.length == 0 }",
    		ctx
    	});

    	return block;
    }

    // (105:4) {#each panel.children as child}
    function create_each_block$1(ctx) {
    	let vguipanel;
    	let current;

    	vguipanel = new VguiPanel({
    			props: { panel: /*child*/ ctx[19] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(vguipanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(vguipanel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const vguipanel_changes = {};
    			if (dirty & /*panel*/ 1) vguipanel_changes.panel = /*child*/ ctx[19];
    			vguipanel.$set(vguipanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(vguipanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(vguipanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(vguipanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(105:4) {#each panel.children as child}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*panel*/ ctx[0].properties.visible || /*$showAllHidden*/ ctx[4]) && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*panel*/ ctx[0].properties.visible || /*$showAllHidden*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*panel, $showAllHidden*/ 17) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function parsePosition(value) {
    	let digit = typeof value != "undefined"
    	? value.replace(/[^\d.-]/g, "")
    	: "0";

    	return {
    		f: value.includes("f"),
    		c: value.includes("c"),
    		d: value.includes("d"),
    		r: value.includes("r"),
    		s: value.includes("s"),
    		absolute: Math.abs(parseInt(digit)),
    		negative: value.includes("-"),
    		value: digit,
    		num: parseInt(digit)
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let panelStyle;
    	let highlight;
    	let hasLabel;
    	let $viewportScales;
    	let $viewportProportions;
    	let $currentEditingVguiPanel;
    	let $showAllHidden;
    	let $panelLabelOptions;
    	validate_store(viewportScales, "viewportScales");
    	component_subscribe($$self, viewportScales, $$value => $$invalidate(10, $viewportScales = $$value));
    	validate_store(viewportProportions, "viewportProportions");
    	component_subscribe($$self, viewportProportions, $$value => $$invalidate(11, $viewportProportions = $$value));
    	validate_store(currentEditingVguiPanel, "currentEditingVguiPanel");
    	component_subscribe($$self, currentEditingVguiPanel, $$value => $$invalidate(12, $currentEditingVguiPanel = $$value));
    	validate_store(showAllHidden, "showAllHidden");
    	component_subscribe($$self, showAllHidden, $$value => $$invalidate(4, $showAllHidden = $$value));
    	validate_store(panelLabelOptions, "panelLabelOptions");
    	component_subscribe($$self, panelLabelOptions, $$value => $$invalidate(5, $panelLabelOptions = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("VguiPanel", slots, []);
    	var _a, _b;
    	
    	
    	let { panel } = $$props;

    	// TODO: Consider proportionalToParent
    	function makeStyles(panelProperties, scales, proportions) {
    		let { wide = "0", tall = "0", xpos = "0", ypos = "0", RoundedCorners = 0 } = panelProperties;

    		return `
      position: absolute;
      border-radius: ${RoundedCorners}px;
      ${parseWide(wide)}
      ${parseTall(tall)}
      ${parseXPos(xpos)}
      ${parseYPos(ypos)}
    `;
    	}

    	// ---------------------------------------------------------------------------
    	//  Make panel styling for width
    	// ---------------------------------------------------------------------------
    	function parseWide(value) {
    		let parsed = parsePosition(value);
    		if (parsed.f) return `right: calc( 0px + ${parsed.absolute * $viewportScales.width}px);`;
    		return `width: ${parsed.num * $viewportScales.width}px;`;
    	}

    	// ---------------------------------------------------------------------------
    	//  Make panel styling for height
    	// ---------------------------------------------------------------------------
    	function parseTall(value) {
    		let parsed = parsePosition(value);
    		if (parsed.f) return `bottom: calc( 0px + ${parsed.absolute * $viewportScales.height}px);`;
    		return `height: ${parsed.num * $viewportScales.height}px;`;
    	}

    	// ---------------------------------------------------------------------------
    	//  Make panel styling for xpos
    	// ---------------------------------------------------------------------------
    	function parseXPos(value) {
    		let parsed = parsePosition(value);
    		if (parsed.c) return `left: calc(50% + ${parsed.num * $viewportScales.width}px);`;
    		if (parsed.r) return `right: ${parsed.absolute * $viewportScales.width}px;`;
    		return `left: ${parsed.num * $viewportScales.width}px;`;
    	}

    	// ---------------------------------------------------------------------------
    	//  Make panel styling for ypos
    	// ---------------------------------------------------------------------------
    	function parseYPos(value) {
    		let parsed = parsePosition(value);
    		if (parsed.c) return `top: calc(50% + ${parsed.num * $viewportScales.height}px);`;
    		if (parsed.r) return `bottom: ${parsed.absolute * $viewportScales.height}px;`;
    		if (parsed.d) return `bottom: ${parsed.absolute * $viewportScales.height}px;`;
    		return `top: ${parsed.num * $viewportScales.height}px;`;
    	}

    	// Clicking a panel will open the properties menu for the panel
    	function setCurrentEditingVguiPanel() {
    		currentEditingVguiPanel.set(panel);
    	}

    	const writable_props = ["panel"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<VguiPanel> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setCurrentEditingVguiPanel();

    	$$self.$$set = $$props => {
    		if ("panel" in $$props) $$invalidate(0, panel = $$props.panel);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		_b,
    		currentEditingVguiPanel,
    		panelLabelOptions,
    		showAllHidden,
    		viewportProportions,
    		viewportScales,
    		panel,
    		makeStyles,
    		parsePosition,
    		parseWide,
    		parseTall,
    		parseXPos,
    		parseYPos,
    		setCurrentEditingVguiPanel,
    		$viewportScales,
    		panelStyle,
    		$viewportProportions,
    		highlight,
    		$currentEditingVguiPanel,
    		hasLabel,
    		$showAllHidden,
    		$panelLabelOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("_a" in $$props) $$invalidate(8, _a = $$props._a);
    		if ("_b" in $$props) $$invalidate(9, _b = $$props._b);
    		if ("panel" in $$props) $$invalidate(0, panel = $$props.panel);
    		if ("panelStyle" in $$props) $$invalidate(1, panelStyle = $$props.panelStyle);
    		if ("highlight" in $$props) $$invalidate(2, highlight = $$props.highlight);
    		if ("hasLabel" in $$props) $$invalidate(3, hasLabel = $$props.hasLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*panel, $viewportScales, $viewportProportions*/ 3073) {
    			// Update styling when any of these conditions change
    			$$invalidate(1, panelStyle = makeStyles(panel.properties));
    		}

    		if ($$self.$$.dirty & /*$currentEditingVguiPanel, panel*/ 4097) {
    			// Highlight the panel currently being edited.
    			$$invalidate(2, highlight = ($currentEditingVguiPanel === null || $currentEditingVguiPanel === void 0
    			? void 0
    			: $currentEditingVguiPanel.name) == (panel === null || panel === void 0 ? void 0 : panel.name));
    		}

    		if ($$self.$$.dirty & /*panel, _a, _b*/ 769) {
    			// Determine if the panel has a non-empty labelText property to show
    			$$invalidate(3, hasLabel = ($$invalidate(8, _a = panel === null || panel === void 0
    			? void 0
    			: panel.properties) === null || _a === void 0
    			? void 0
    			: _a.labelText) && ($$invalidate(9, _b = panel === null || panel === void 0
    			? void 0
    			: panel.properties) === null || _b === void 0
    			? void 0
    			: _b.labelText) !== "\"\"");
    		}
    	};

    	return [
    		panel,
    		panelStyle,
    		highlight,
    		hasLabel,
    		$showAllHidden,
    		$panelLabelOptions,
    		setCurrentEditingVguiPanel,
    		parsePosition,
    		_a,
    		_b,
    		$viewportScales,
    		$viewportProportions,
    		$currentEditingVguiPanel,
    		click_handler
    	];
    }

    class VguiPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { panel: 0, parsePosition: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VguiPanel",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*panel*/ ctx[0] === undefined && !("panel" in props)) {
    			console.warn("<VguiPanel> was created without expected prop 'panel'");
    		}
    	}

    	get panel() {
    		throw new Error("<VguiPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set panel(value) {
    		throw new Error("<VguiPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parsePosition() {
    		return parsePosition;
    	}

    	set parsePosition(value) {
    		throw new Error("<VguiPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\VguiPreview.svelte generated by Svelte v3.38.2 */
    const file = "src\\components\\VguiPreview.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (17:2) {#if $vguiResource}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$vguiResource*/ ctx[3].children;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$vguiResource*/ 8) {
    				each_value = /*$vguiResource*/ ctx[3].children;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(17:2) {#if $vguiResource}",
    		ctx
    	});

    	return block;
    }

    // (18:3) {#each $vguiResource.children as child}
    function create_each_block(ctx) {
    	let vguipanel;
    	let current;

    	vguipanel = new VguiPanel({
    			props: { panel: /*child*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(vguipanel.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(vguipanel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const vguipanel_changes = {};
    			if (dirty & /*$vguiResource*/ 8) vguipanel_changes.panel = /*child*/ ctx[6];
    			vguipanel.$set(vguipanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(vguipanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(vguipanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(vguipanel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(18:3) {#each $vguiResource.children as child}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let div0_style_value;
    	let div0_resize_listener;
    	let current;
    	let if_block = /*$vguiResource*/ ctx[3] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "vguiRoot adaptive   svelte-153iv2t");
    			attr_dev(div0, "style", div0_style_value = `aspect-ratio: ${/*$aspectRatio*/ ctx[2]};`);
    			add_render_callback(() => /*div0_elementresize_handler*/ ctx[5].call(div0));
    			add_location(div0, file, 13, 1, 538);
    			attr_dev(div1, "class", "container svelte-153iv2t");
    			add_location(div1, file, 12, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			div0_resize_listener = add_resize_listener(div0, /*div0_elementresize_handler*/ ctx[5].bind(div0));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$vguiResource*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$vguiResource*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$aspectRatio*/ 4 && div0_style_value !== (div0_style_value = `aspect-ratio: ${/*$aspectRatio*/ ctx[2]};`)) {
    				attr_dev(div0, "style", div0_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			div0_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $enableAdaptingViewport;
    	let $aspectRatio;
    	let $vguiResource;
    	validate_store(enableAdaptingViewport, "enableAdaptingViewport");
    	component_subscribe($$self, enableAdaptingViewport, $$value => $$invalidate(4, $enableAdaptingViewport = $$value));
    	validate_store(aspectRatio, "aspectRatio");
    	component_subscribe($$self, aspectRatio, $$value => $$invalidate(2, $aspectRatio = $$value));
    	validate_store(vguiResource, "vguiResource");
    	component_subscribe($$self, vguiResource, $$value => $$invalidate(3, $vguiResource = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("VguiPreview", slots, []);
    	let viewportWidth, viewportHeight;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<VguiPreview> was created with unknown prop '${key}'`);
    	});

    	function div0_elementresize_handler() {
    		viewportWidth = this.offsetWidth;
    		viewportHeight = this.offsetHeight;
    		$$invalidate(0, viewportWidth);
    		$$invalidate(1, viewportHeight);
    	}

    	$$self.$capture_state = () => ({
    		aspectRatio,
    		enableAdaptingViewport,
    		vguiResource,
    		viewportProportions,
    		viewportScales,
    		vguiBaseWidth,
    		vguiBaseHeight,
    		VguiPanel,
    		viewportWidth,
    		viewportHeight,
    		$enableAdaptingViewport,
    		$aspectRatio,
    		$vguiResource
    	});

    	$$self.$inject_state = $$props => {
    		if ("viewportWidth" in $$props) $$invalidate(0, viewportWidth = $$props.viewportWidth);
    		if ("viewportHeight" in $$props) $$invalidate(1, viewportHeight = $$props.viewportHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$enableAdaptingViewport, viewportWidth, viewportHeight*/ 19) {
    			{
    				viewportProportions.set({
    					width: $enableAdaptingViewport ? viewportWidth : vguiBaseWidth,
    					height: $enableAdaptingViewport
    					? viewportHeight
    					: vguiBaseHeight
    				});
    			}
    		}
    	};

    	return [
    		viewportWidth,
    		viewportHeight,
    		$aspectRatio,
    		$vguiResource,
    		$enableAdaptingViewport,
    		div0_elementresize_handler
    	];
    }

    class VguiPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VguiPreview",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.38.2 */

    // (18:0) <Content style={contentStyle}  >
    function create_default_slot(ctx) {
    	let vguipanelproperties;
    	let t;
    	let vguipreview;
    	let current;
    	vguipanelproperties = new VguiPanelProperties({ $$inline: true });
    	vguipreview = new VguiPreview({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(vguipanelproperties.$$.fragment);
    			t = space();
    			create_component(vguipreview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(vguipanelproperties, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(vguipreview, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(vguipanelproperties.$$.fragment, local);
    			transition_in(vguipreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(vguipanelproperties.$$.fragment, local);
    			transition_out(vguipreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(vguipanelproperties, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(vguipreview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(18:0) <Content style={contentStyle}  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let resourcetree;
    	let t0;
    	let header;
    	let t1;
    	let content;
    	let current;
    	resourcetree = new ResourceTree({ $$inline: true });
    	header = new Header_1({ $$inline: true });

    	content = new Content({
    			props: {
    				style: /*contentStyle*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(resourcetree.$$.fragment);
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(content.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(resourcetree, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(header, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const content_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(resourcetree.$$.fragment, local);
    			transition_in(header.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(resourcetree.$$.fragment, local);
    			transition_out(header.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(resourcetree, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	const contentStyle = `
		background-color: transparent;
		height: 100%;
		padding: 0;

		display: grid;
		grid-template-columns: 270px 1fr;
	`;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Content,
    		Header: Header_1,
    		ResourceTree,
    		VguiPanelProperties,
    		VguiPreview,
    		contentStyle
    	});

    	return [contentStyle];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

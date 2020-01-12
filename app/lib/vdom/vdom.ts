// Create virtual nodes /////////////////////////////////////////////////////////////////

class VElement {
    public tag;
    public style;
    public attrs;
    public props;
    public className;
    public dom;

    constructor(tag, attrs, props, dom = null) {
        this.tag = tag;
        this.style = attrs.style;
        this.attrs = attrs;
        this.props = props;
        this.className = attrs.className;
        this.dom = dom;
    }
}

export function createElement(tag, config, children: null | [] | {} = null) {
    // If the tag is a function. We have a component!
    // we will see later why. 
    if (typeof tag === 'function') {
        //of course we could do some checks here if the props are 
        //valid or not.
        const vNode = createVComponent(tag, config);
        return vNode;
    }

    //Add children on our props object, just as in React. Where
    //we can acces it using this.props.children;

    const vNode: VElement = createVElement(tag, config, children);
    return vNode;
}


// Create a vNode for a class Component
export function createVComponent(tag, props) {
    return {
        tag: tag,
        props: props,
        dom: null,
    }
}


// Create a vNode for a DOM element
export function createVElement(tag, attrs, children: null | [] | {} = null): VElement {
    const vElem = new VElement(tag, attrs, { children: children });
    return vElem;
}




// Update virtual nodes ////////////////////////////////////////////////////////////////////

export function updateVElement(prevElement: VElement, nextElement) {
    const dom = prevElement.dom;
    nextElement.dom = dom;

    if (nextElement.props.children) {
        updateChildren(prevElement.props.children, nextElement.props.children, dom);
    }

    if (prevElement.style !== nextElement.style) {
        Object.keys(nextElement.style).forEach((s) => dom.style[s] = nextElement.style[s])
    }
}

export function updateVText(prevText, nextText, parentDOM) {
    if (prevText !== nextText) {
        parentDOM.firstChild.nodeValue = nextText;
    }
}

export function updateChildren(prevChildren, nextChildren, parentDOMNode) {
    if (!Array.isArray(nextChildren)) {
        nextChildren = [nextChildren];
    }
    if (!Array.isArray(prevChildren)) {
        prevChildren = [prevChildren];
    }

    for (let i = 0; i < nextChildren.length; i++) {
        //We're skipping a lot of cases here. Like what if
        //the children array have different lenghts? Then we 
        //should replace smartly etc. :)
        const nextChild = nextChildren[i];
        const prevChild = prevChildren[i];


        //Check if the vNode is a vText
        if (typeof nextChild === 'string' && typeof prevChild === 'string') {
            //We're taking a shortcut here. It would cleaner to
            //let the `update` function handle it, but we would to add some extra
            //logic because we don't have a `tag` property. 
            updateVText(prevChild, nextChild, parentDOMNode);
            continue;
        } else {
            update(prevChild, nextChild);
        }
    }
}

export function updateVComponent(prevComponent, nextComponent) {

    //get the instance. This is Component. It also 
    //holds the props and _currentElement; 
    const { _instance } = prevComponent;
    const { _currentElement } = _instance;

    //get the new and old props!
    const prevProps = prevComponent.props;
    const nextProps = nextComponent.props;

    //Time for the big swap!
    nextComponent.dom = prevComponent.dom;
    nextComponent._instance = _instance;
    nextComponent._instance.props = nextProps;

    if (_instance.shouldComponentUpdate()) {
        const prevRenderedElement = _currentElement;
        const nextRenderedElement = _instance.render();
        //finaly save the nextRenderedElement for the next iteration!
        nextComponent._instance._currentElement = nextRenderedElement;
        //call update 
        update(prevRenderedElement, nextRenderedElement);// _instance._parentNode);
    }
}



// Component base class ///////////////////////////////////////////////////////////////////////

export class Component {
    props;
    state: null | {} = {};
    _currentElement: any = null;
    _pendingState = null;
    _parentNode = null;

    constructor(props) {
        this.props = props || {};
        this.state = {};
    }

    //add this in existing code
    shouldComponentUpdate() {
        return true;
    }

    updateComponent() {
        const prevState = this.state;
        const prevElement = this._currentElement;

        if (this._pendingState !== prevState) {
            this.state = this._pendingState;
        }

        this._pendingState = null;
        const nextElement = this.render();
        this._currentElement = nextElement;

        update(prevElement, nextElement);
    }

    setState(partialNewState) {
        // I know this looks weired. Why don't pass state to updateComponent()
        // function, I agree. 
        // We're just getting a little familiair with putting data on instances. 
        // seomthing that React uses heavily :)
        this._pendingState = Object.assign({}, this.state, partialNewState);
        this.updateComponent();
    }
    //will be overridden
    render() { }
}

export function update(prevElement, nextElement) {
    //Implement the first assumption!
    if (prevElement.tag === nextElement.tag) {
        //Inspect the type. If the `tag` is a string
        //we have a `vElement`. (we should actually
        //made some helper functions for this ;))
        if (typeof prevElement.tag === 'string') {
            updateVElement(prevElement, nextElement);
        } else if (typeof prevElement.tag === 'function') {
            updateVComponent(prevElement, nextElement);
        }
    } else {
        //Oh oh two elements of different types. We don't want to 
        //look further in the tree! We need to replace it!
    }
}





// Render virtual nodes to dom nodes ////////////////////////////////////////////////////////////////

export function renderElement(vNode) {

    console.log("renderElement", vNode);

    const { tag, style, attrs, props } = vNode;

    // create the element
    //   e.g. <div></div>
    const $el = document.createElement(tag);

    // add all attributes as specified in vNode.attrs
    //   e.g. <div id="app"></div>
    for (const [k, v] of Object.entries(attrs)) {
        $el.setAttribute(k, v);
    }

    // append all children as specified in vNode.children
    //   e.g. <div id="app"><img></div>
    if (props.children) {
        for (const child of props.children) {
            $el.appendChild(render(child));
        }
    }

    return $el;
};

export function render(vNode) {
    if (typeof vNode === 'string') {
        return document.createTextNode(vNode);
    }

    // we assume everything else to be a virtual element
    return renderElement(vNode);
};




// Mount the rendered nodes to the DOM //////////////////////////////////////////////////////////

export function mount($node, $target) {
    $target.replaceWith($node);
    return $node;
};


export function mount_old(input, parentDOMNode) {
    console.log("Mount", input);

    if (typeof input === 'string' || typeof input === 'number') {
        //we have a vText
        console.log("mount text", input);
        return mountVText(input, parentDOMNode);
    }
    else if (typeof input.tag === 'function') {
        //we have a component
        console.log("mount vcomponent", input);
        return mountVComponent(input, parentDOMNode);
    }
    // for brevity make an else if statement. An
    // else would suffice. 
    else if (typeof input.tag === 'string') {
        //we have a vElement
        console.log("mount velement", input);
        return mountVElement(input, parentDOMNode)
    }
}

export function mountVComponent(vComponent, parentDOMNode) {
    const { tag, props } = vComponent;

    const Component = tag;
    const instance = new Component(props);

    const nextRenderedElement = instance.render();
    //create a reference of our currenElement
    //on our component instance.
    instance._currentElement = nextRenderedElement;

    //create a reference to the passed
    //DOMNode. We might need it.
    instance._parentNode = parentDOMNode;

    const dom = mount(nextRenderedElement, parentDOMNode);

    //save the instance for later!
    vComponent._instance = instance;
    vComponent.dom = dom;

    parentDOMNode.appendChild(dom);
}

export function mountVText(vText, parentDOMNode) {
    // Oeeh we received a vText with it's associated parentDOMNode.
    // we can set it's textContent to the vText value. 
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    parentDOMNode.textContent = vText;
}

export function mountVElement(vElement: VElement, parentDOMNode) {
    const { className, tag, attrs, props, style } = vElement;

    console.log('Mount', vElement);

    const domNode = document.createElement(tag);
    vElement.dom = domNode;

    if (props.children) {
        if (!Array.isArray(props.children)) {
            mount(props.children, domNode)
        } else {
            props.children.forEach(child => mount(child, domNode));
        }
    }

    if (className !== undefined) {
        domNode.className = className;
    }

    if (style !== undefined) {
        Object.keys(style).forEach(sKey => domNode.style[sKey] = style[sKey]);
    }

    parentDOMNode.appendChild(domNode);

    return domNode;
}
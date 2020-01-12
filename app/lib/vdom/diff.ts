const diff = (oldVTree, newVTree) => {
    // let's assume oldVTree is not undefined!
    if (newVTree === undefined) {
        return $node => {
            $node.remove();
            // the patch should return the new root node.
            // since there is none in this case,
            // we will just return undefined.
            return undefined;
        }
    }

    if (typeof oldVTree === 'string' ||
        typeof newVTree === 'string') {
        if (oldVTree !== newVTree) {
            // could be 2 cases:
            // 1. both trees are string and they have different values
            // 2. one of the trees is text node and
            //    the other one is elem node
            // Either case, we will just render(newVTree)!
            return $node => {
                const $newNode = render(newVTree);
                $node.replaceWith($newNode);
                return $newNode;
            };
        } else {
            // this means that both trees are string
            // and they have the same values
            return $node => $node;
        }
    }

    if (oldVTree.tagName !== newVTree.tagName) {
        // we assume that they are totally different and 
        // will not attempt to find the differences.
        // simply render the newVTree and mount it.
        return $node => {
            const $newNode = render(newVTree);
            $node.replaceWith($newNode);
            return $newNode;
        };
    }

    // (A)
};


export default diff;
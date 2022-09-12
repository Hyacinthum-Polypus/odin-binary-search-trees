#!/usr/bin/node

function removeDuplicates(array) {
    return array.reduce((newArray, element) => {
        if(newArray.indexOf(element) == -1) {
            newArray.push(element);
        }
        return newArray;
    }, []);
}

function mergeSort(unsortedArray) {
    //console.log("Merge Sort start: " + unsortedArray);
    if(unsortedArray.length < 2) {
        return unsortedArray;
    }

    //sort left half
    let lSortedArray = mergeSort(unsortedArray.slice(0, Math.floor(unsortedArray.length / 2)));
    //sort right half
    let rSortedArray = mergeSort(unsortedArray.slice(Math.floor(unsortedArray.length / 2)));
    //merge
    let sortedArray = [];
    while(lSortedArray.length > 0 || rSortedArray.length > 0) {
        if(lSortedArray[0] < rSortedArray[0]) {
            //console.log(lSortedArray[0] + " < " + rSortedArray[0]);
            sortedArray.push(lSortedArray.shift());
        }
        else {
            //console.log(lSortedArray[0] + " > " + rSortedArray[0]);
            sortedArray.push(rSortedArray.shift());
        }
        if(lSortedArray.length == 0) {
            sortedArray = sortedArray.concat(rSortedArray);
            rSortedArray = [];
        }
        else if (rSortedArray.length == 0) {
            sortedArray = sortedArray.concat(lSortedArray);
            lSortedArray = [];
        }
    }
    //console.log("Finished sort: " + sortedArray);
    return sortedArray;
}

function cleanArray(uncleanArray) {
    const unsortedArray = removeDuplicates(uncleanArray);
    return mergeSort(unsortedArray);
}


function Node(data) {
    let left = null;
    let right = null;
    return {data, left, right}
}

function Tree(array) {
    let cleanedArray = cleanArray(array);
    const buildTree = (array, start, end) => {
        if(start > end) return null;
        const mid = Math.floor((start + end) / 2);
        const root = Node(array[mid]); 
        const left = buildTree(array, start, mid-1);
        const right = buildTree(array, mid+1, end);
        root.left = left;
        root.right = right;
        return root;
    }

    const insert = (data, node = root) => {
        if(data == node.data) {
            return;
        } else if(data > node.data) {
            if(node.right == null) {
                node.right = Node(data);
            } else {
                insert(data, node.right);
            }
        } else if(data < node.data) {
            if(node.left == null) {
                node.left = Node(data);
            } else {
                insert(data, node.left);
            }
        }
    }

    const findInorderSuccessor = (node) => {
        if(node.left == null) {
            const savedData = node.data;
            remove(node.data);
            return savedData;
        } else {
            return findInorderSuccessor(node.left);
        }
    }

    const remove = (data, node = root, parent = null, isLeft = null) => {
        if(data == node.data) {
            if(node.left == null && node.right == null) {
                if(parent == null) {
                    root = null;
                } else {
                    if(isLeft) {
                        parent.left = null;
                    } else {
                        parent.right = null;
                    }
                }
            } else if(node.left == null) {
                if(parent == null) {
                    root = node.right;
                } else {
                    if(isLeft) {
                        parent.left = node.right;
                    } else {
                        parent.right = node.right;
                    }
                }
            } else if(node.right == null) {
                if(parent == null) {
                    root = node.left;
                } else {
                    if(isLeft) {
                        parent.left = node.left;
                    } else {
                        parent.right = node.left;
                    }
                }
            } else {
                if(parent == null) {
                    root.data = findInorderSuccessor(node.right);
                } else {
                    if(isLeft) {
                        parent.left.data = findInorderSuccessor(node.right);
                    } else {
                        parent.right.data = findInorderSuccessor(node.right);
                    }
                }
            }
        } else if(data > node.data) {
            if(node.right == null) {
                return;
            } else {
                remove(data, node.right, node, false);
            }
        } else if(data < node.data) {
            if(node.left == null) {
                return;
            } else {
                remove(data, node.left, node, true);
            }
        }
    }

    const find = (data, node = root) => {
        if(data == node.data) {
            return node;
        } else if(data > node.data) {
            if(node.right == null) {
                return null;
            } else {
                return find(data, node.right);
            }
        } else if(data < node.data) {
            if(node.left == null) {
                return null;
            } else {
                return find(data, node.left);
            }
        }
    }

    const levelOrder = (callbackfn = null) => {
        let queue = [root];
        if(callbackfn == null) {
            let array = [];
        } else {
            let array = null;
        }
        while(queue.length > 0) {
            if(queue[0].left != null) queue.push(queue[0].left);
            if(queue[0].right != null) queue.push(queue[0].right);
            if(callbackfn != null) {
                callbackfn(queue[0]);
            } else {
                array.push(queue[0]);
            }
            queue.shift();
        }
        return array;
    }

    const inorder = (callbackfn = null, node = root) => {
        let array = [];
        if(node.left != null) array = array.concat(inorder(callbackfn, node.left));
        array = array.concat(node);
        if(callbackfn != null) callbackfn(node);
        if(node.right != null) array = array.concat(inorder(callbackfn, node.right));
        if(callbackfn == null) return array;
    }

    const preorder = (callbackfn = null, node = root) => {
        let array = [];
        array = array.concat(node);
        if(callbackfn != null) callbackfn(node);
        if(node.left != null) array = array.concat(preorder(callbackfn, node.left));
        if(node.right != null) array = array.concat(preorder(callbackfn, node.right));
        if(callbackfn == null) return array;
    }

    const postorder = (callbackfn = null, node = root) => {
        let array = [];
        if(node.left != null) array = array.concat(postorder(callbackfn, node.left));
        if(node.right != null) array = array.concat(postorder(callbackfn, node.right));
        array = array.concat(node);
        if(callbackfn != null) callbackfn(node);
        if(callbackfn == null) return array;
    }
    
    const height2 = (node) => {
        let leftH = 0;
        let rightH = 0
        if(node.left != null) leftH = height2(node.left);
        if(node.right != null) rightH = height2(node.right);
        return (1 + (leftH > rightH ? leftH : rightH));
    }

    const height = (data) => {
        let selectedNode = find(data);
        if(selectedNode != null) return height2(selectedNode) - 1;
    }

    const depth = (data, node = root, h = 0) => {
        h++;
        if(data == node.data) {
            return h - 1;
        } else if(data > node.data) {
            if(node.right == null) {
                return null;
            } else {
                return depth(data, node.right, h);
            }
        } else if(data < node.data) {
            if(node.left == null) {
                return null;
            } else {
                return depth(data, node.left, h);
            }
        }
    }

    const isBalanced2 = node => {
        let leftH = 0;
        let rightH = 0;

        if(node.left != null) leftH = height(node.left.data) + 1;
        if(node.right != null) rightH = height(node.right.data) + 1;

        if(leftH == rightH) {
            return true;
        } else if(leftH > rightH) {
            return !((leftH - rightH) > 1);
        } else {
            return !((rightH - leftH) > 1);
        }
    }

    const isBalanced = () => {
        const nodes = inorder();
        let isTreeBalanced = true;
        for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            isThisNodeBalanced = isBalanced2(node);
            if(!isThisNodeBalanced) {
                isTreeBalanced = false;
                break;
            }
        }
        return isTreeBalanced;
    }

    const prettyPrint = (node = root, prefix = '', isLeft = true) => {
        if (node.right !== null) {
          prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
        if (node.left !== null) {
          prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
    }

    const rebalance = () => {
        const nodes = inorder();
        let data = nodes.reduce((data, node) => {
            data.push(node.data);
            return data;
        }, []);
        root = buildTree(cleanArray(data), 0, data.length - 1);
    }

    let root = buildTree(cleanedArray, 0, cleanedArray.length - 1);

    return {root, prettyPrint, insert, remove, find, levelOrder, inorder, preorder, postorder, height, depth, isBalanced, rebalance};
}

const myArray = [463, 487, 838, 38, 511, 144, 318, 525, 178, 997, 801, 468, 140, 519, 723, 412, 719];

const myTree = Tree(myArray);

myTree.prettyPrint();

console.log(myTree.isBalanced());

console.log("Level order:");
myTree.levelOrder(node => console.log(node.data));

console.log("Preorder:");
myTree.preorder(node => console.log(node.data));

console.log("Postorder:");
myTree.postorder(node => console.log(node.data));

console.log("Inorder:");
myTree.inorder(node => console.log(node.data));

myTree.insert(100);
myTree.insert(350);
myTree.insert(450);
myTree.insert(500);
myTree.insert(800);
myTree.insert(1240);
myTree.insert(770);

myTree.prettyPrint();
console.log(myTree.isBalanced());

myTree.rebalance();
myTree.prettyPrint();
console.log(myTree.isBalanced());

console.log("Level order:");
myTree.levelOrder(node => console.log(node.data));

console.log("Preorder:");
myTree.preorder(node => console.log(node.data));

console.log("Postorder:");
myTree.postorder(node => console.log(node.data));

console.log("Inorder:");
myTree.inorder(node => console.log(node.data));
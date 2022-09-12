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

    const levelOrder = (callbackfn) => {
        let queue = [root];
        while(queue.length > 0) {
            if(queue[0].left != null) {
                queue.push(queue[0].left);
            }
            if(queue[0].right != null) {
                queue.push(queue[0].right);
            }
            callbackfn(queue[0]);
            queue.shift();
        }

    }

    const root = buildTree(cleanedArray, 0, cleanedArray.length - 1);

    return {root, insert, remove, find, levelOrder};
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
}

myArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

myTree = Tree(myArray);

prettyPrint(myTree.root);

myTree.insert(10);
myTree.insert(20);
myTree.insert(7);

prettyPrint(myTree.root);

myTree.remove(20);

prettyPrint(myTree.root);

myTree.remove(23);

prettyPrint(myTree.root);

myTree.remove(4);

prettyPrint(myTree.root);

myTree.remove(8);

prettyPrint(myTree.root);

console.log(myTree.find(324));

myTree.levelOrder(console.log);
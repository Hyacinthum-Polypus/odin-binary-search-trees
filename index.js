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

    const root = buildTree(cleanedArray, 0, cleanedArray.length - 1);

    return root;
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

prettyPrint(myTree);
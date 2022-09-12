#!/usr/bin/node

function removeDuplicates(array) {
    array.reduce((newArray, currentElement) => {
        if(newArray.find(currentElement) == undefined) {
            newArray.push(currentElement);
            return newArray;
        }
    }, []);
    return array;
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


function Node(value) {
    let left = null;
    let right = null;
    return {value, left, right}
}

function Tree(array) {
    let cleanedArray = cleanArray(array);
    const buildTree = (array) => {
        if(array == []) return null;
        const mid = array.length // 2;
        const root = Node(array[mid]); 
        const left = buildTree(array.slice(0, mid-1));
        const right = buildTree(array.slice(mid+1, array.length));
        root.left = left;
        root.right = right;
        return root;
    }

    const root = buildTree(cleanedArray)

    return root;
}
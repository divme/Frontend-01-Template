
// ------------------------- 数组 --------------------------------
// 1. 真题描述： 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
//              你可以假设每种输入只会对应一个答案。但是，你不能重复利用这个数组中同样的元素。
// 示例: 给定 nums = [2, 7, 11, 15], target = 9
// 因为 nums[0] + nums[1] = 2 + 7 = 9 所以返回 [0, 1]

function getTotal(arr, target) {
    for (let m = 0; m < arr.length; m++) {
        for (let n = 0; n < arr.length; n++) {
            if (arr[m] + arr[n] === target) {
                return [m , n]
            }
        }
    }
}

function getTotal1(arr, target) {
    const map = {}
    for (let m = 0, len = arr.length; m < len; m++) {
        if (map[target - arr[m]] !== undefined) {
            return [m, map[target - arr[m]]]
        }
        map[arr[m]] = m
    }
}

// 2. 合并两个有序数组
// 真题描述：给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
// 说明: 初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。 你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。

// 示例: 输入:
// nums1 = [1,4,5,0,0,0], m = 3
// nums2 = [2,3,6], n = 3
// 输出: [1,2,2,3,5,6]

var nums1 = [1,4,5,0,0,0]
var nums2 = [2,3,6]

function mergeArrs(arr1, arr2) {
    while(arr1[arr1.length - 1] === 0) arr1.pop()
    arr1 = arr1.concat(arr2).sort((a,b) => a - b)
    return arr1
}

function merge(arr1, m, arr2, n) {
    let i = m - 1
    let j = n - 1
    let k = m + n - 1
   
    while (j >= 0) {
        if (i < 0) {
            arr1[k--] = arr2[j--]
            continue
        }

        arr1[k--] = arr1[i] > arr2[j] ? arr1[i--] : arr2[j--]
    }


    while (i >= 0 && j >= 0) {
        if (arr1[i] > arr2[j]) {
            arr1[k] = arr1[i]
            i--
        } else {
            arr1[k] = arr2[j]
            j--
        }
        k--
    }
    while (j > 0) {
        arr1[k] = arr2[j]
        k--
        j--
    }
}

// 3. 三数求和问题
// 真题描述：给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组。
// 注意：答案中不可以包含重复的三元组。

// 示例： 给定数组 nums = [-1, 0, 1, 2, -1, -4]， 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]

var nums = [-1, 0, 1, 2, -1, -4]
function threeCount(nums) {
   nums = nums.sort((a, b) => a - b)
   let result = [] 
   for (let m = 0, len = nums.length; m < len - 2; m++) {
       let left = m + 1
       let right = len - 1

       if (m > 0 && nums[m] === nums[m - 1]) {
           continue
       }

       while (left < right) {
            if (nums[m] + nums[left] + nums[right] === 0) {

                result.push([nums[m], nums[left], nums[right]])

                left++
                right--

                while(left < right && nums[left] === nums[left-1]) {
                    left++
                }
                while(left < right && nums[right] === nums[right + 1]) {
                    right--
                }

            } else if (nums[m] + nums[left] + nums[right] < 0) {

                left++

                while(left < right && nums[left] === nums[left-1]) {
                    left++
                }
                
            } else {

                right--

                while(left < right && nums[right] === nums[right + 1]) {
                    right--
                }
            }

       }   
   }
   return result
}
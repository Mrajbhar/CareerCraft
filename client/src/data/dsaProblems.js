
export const dsaProblems = {
  "Two Sum": {
    func: "two_sum",
    tests: [{ args: [[2, 7, 11, 15], 9], expected: [0, 1] }, { args: [[3, 2, 4], 6], expected: [1, 2] }, { args: [[3, 3], 6], expected: [0, 1] }],
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    statement:
      "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10^4", "-10^9 ≤ nums[i] ≤ 10^9", "Exactly one valid answer exists."],
    hints: [
      "The brute force checks every pair in O(n²). Can you avoid the inner loop?",
      "As you scan, store each value's index in a hash map.",
      "For the current value x, you need target - x. Has it been seen already?",
    ],
    starter:
      "def two_sum(nums, target):\n    seen = {}            # value -> index\n    # TODO: return the two indices that sum to target\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))   # expected [0, 1]\nprint(two_sum([3, 2, 4], 6))         # expected [1, 2]",
  },

  "Contains Duplicate": {
    func: "contains_duplicate",
    tests: [{ args: [[1, 2, 3, 1]], expected: true }, { args: [[1, 2, 3, 4]], expected: false }, { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }],
    difficulty: "Easy",
    topic: "Arrays & Hashing",
    statement:
      "Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "true", explanation: "1 appears twice." },
      { input: "nums = [1,2,3,4]", output: "false" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9"],
    hints: ["A set stores only unique values.", "Compare the size of a set built from nums with len(nums)."],
    starter:
      "def contains_duplicate(nums):\n    # TODO: return True if any value repeats\n    return False\n\nprint(contains_duplicate([1, 2, 3, 1]))  # expected True\nprint(contains_duplicate([1, 2, 3, 4]))  # expected False",
  },

  "Group Anagrams": {
    func: "group_anagrams",
    tests: [{ args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] }, { args: [[""]], expected: [[""]] }],
    difficulty: "Medium",
    topic: "Arrays & Hashing",
    statement:
      "Given an array of strings, group together the strings that are anagrams of each other. An anagram uses exactly the same letters with the same counts, rearranged. Return the groups in any order.",
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
    ],
    constraints: ["1 ≤ strs.length ≤ 10^4", "0 ≤ strs[i].length ≤ 100", "strs[i] is lowercase English letters."],
    hints: [
      "Anagrams share the same sorted letters — use that as a key.",
      "Or use a 26-length letter count tuple as the key (faster than sorting).",
      "Map key -> list of words, then return the lists.",
    ],
    starter:
      "def group_anagrams(strs):\n    groups = {}          # key -> list of words\n    # TODO: group words that are anagrams\n    return list(groups.values())\n\nprint(group_anagrams([\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]))",
  },

  "Top K Frequent Elements": {
    func: "top_k_frequent",
    tests: [{ args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] }, { args: [[1], 1], expected: [1] }],
    difficulty: "Medium",
    topic: "Arrays & Hashing",
    statement:
      "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "k is in the range [1, number of distinct elements]"],
    hints: [
      "Count frequencies with a hash map.",
      "Bucket sort by frequency gives O(n); a heap gives O(n log k).",
    ],
    starter:
      "def top_k_frequent(nums, k):\n    # TODO: return the k most frequent values\n    return []\n\nprint(top_k_frequent([1,1,1,2,2,3], 2))  # expected [1, 2]",
  },

  "Product of Array Except Self": {
    difficulty: "Medium",
    topic: "Arrays & Hashing",
    statement:
      "Given an integer array nums, return an array answer where answer[i] is the product of every element except nums[i]. Solve it without using division and in O(n) time.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10^5", "The product of any prefix/suffix fits in a 32-bit integer."],
    hints: [
      "answer[i] = (product of everything left of i) × (product of everything right of i).",
      "Do one left-to-right pass for prefixes, then a right-to-left pass for suffixes.",
    ],
    starter:
      "def product_except_self(nums):\n    n = len(nums)\n    res = [1] * n\n    # TODO: prefix pass, then suffix pass\n    return res\n\nprint(product_except_self([1,2,3,4]))  # expected [24, 12, 8, 6]",
  },

  "Valid Palindrome": {
    func: "is_palindrome",
    tests: [{ args: ["A man, a plan, a canal: Panama"], expected: true }, { args: ["race a car"], expected: false }, { args: [" "], expected: true }],
    difficulty: "Easy",
    topic: "Two Pointers",
    statement:
      "A phrase is a palindrome if, after lowercasing and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: 'Cleaned form is "amanaplanacanalpanama".' },
      { input: 's = "race a car"', output: "false" },
      { input: 's = " "', output: "true", explanation: "Empty after cleaning, which is a palindrome." },
    ],
    constraints: ["1 ≤ s.length ≤ 2 × 10^5", "s contains printable ASCII characters."],
    hints: [
      "Use two pointers from both ends moving inward.",
      "Skip characters that aren't letters or digits; compare lowercased.",
    ],
    starter:
      "def is_palindrome(s):\n    i, j = 0, len(s) - 1\n    # TODO: two-pointer check, skipping non-alphanumerics\n    return True\n\nprint(is_palindrome(\"A man, a plan, a canal: Panama\"))  # expected True\nprint(is_palindrome(\"race a car\"))                       # expected False",
  },

  "3Sum": {
    func: "three_sum",
    tests: [{ args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] }, { args: [[0, 1, 1]], expected: [] }, { args: [[0, 0, 0]], expected: [[0, 0, 0]] }],
    difficulty: "Medium",
    topic: "Two Pointers",
    statement:
      "Given an integer array nums, return all unique triplets [a, b, c] such that a + b + c = 0. The solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    constraints: ["3 ≤ nums.length ≤ 3000", "-10^5 ≤ nums[i] ≤ 10^5"],
    hints: [
      "Sort first — it makes duplicate-skipping and two-pointer scanning easy.",
      "Fix one number, then two-pointer the rest for the remaining target.",
      "Skip equal neighbors to avoid duplicate triplets.",
    ],
    starter:
      "def three_sum(nums):\n    nums.sort()\n    res = []\n    # TODO: fix i, two-pointer j and k\n    return res\n\nprint(three_sum([-1,0,1,2,-1,-4]))  # expected [[-1,-1,2],[-1,0,1]]",
  },

  "Container With Most Water": {
    func: "max_area",
    tests: [{ args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 }, { args: [[1, 1]], expected: 1 }],
    difficulty: "Medium",
    topic: "Two Pointers",
    statement:
      "Given an array height where height[i] is the height of a vertical line at position i, pick two lines that together with the x-axis hold the most water. Return that maximum area. Area = width × min(of the two heights).",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" },
    ],
    constraints: ["2 ≤ height.length ≤ 10^5", "0 ≤ height[i] ≤ 10^4"],
    hints: [
      "Start with the widest container (both ends).",
      "Moving the taller line inward can't help — always move the shorter one.",
    ],
    starter:
      "def max_area(height):\n    i, j = 0, len(height) - 1\n    best = 0\n    # TODO: shrink from the shorter side\n    return best\n\nprint(max_area([1,8,6,2,5,4,8,3,7]))  # expected 49",
  },

  "Best Time to Buy and Sell Stock": {
    func: "max_profit",
    tests: [{ args: [[7, 1, 5, 3, 6, 4]], expected: 5 }, { args: [[7, 6, 4, 3, 1]], expected: 0 }, { args: [[1, 2]], expected: 1 }],
    difficulty: "Easy",
    topic: "Sliding Window",
    statement:
      "You are given an array prices where prices[i] is the price of a stock on day i. Buy on one day and sell on a later day. Return the maximum profit, or 0 if no profit is possible.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy at 1, sell at 6." },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices only fall." },
    ],
    constraints: ["1 ≤ prices.length ≤ 10^5", "0 ≤ prices[i] ≤ 10^4"],
    hints: [
      "Track the lowest price seen so far as you scan.",
      "At each day, the best sale today = price - min so far.",
    ],
    starter:
      "def max_profit(prices):\n    best = 0\n    lowest = float('inf')\n    # TODO: one pass tracking the minimum\n    return best\n\nprint(max_profit([7,1,5,3,6,4]))  # expected 5\nprint(max_profit([7,6,4,3,1]))    # expected 0",
  },

  "Valid Parentheses": {
    func: "is_valid",
    tests: [{ args: ["()[]{}"], expected: true }, { args: ["(]"], expected: false }, { args: ["([)]"], expected: false }, { args: ["{[]}"], expected: true }],
    difficulty: "Easy",
    topic: "Stack",
    statement:
      "Given a string containing only the characters (), {} and [], decide whether it is valid. It's valid when every opening bracket is closed by the matching type in the correct order.",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
      { input: 's = "([)]"', output: "false" },
      { input: 's = "{[]}"', output: "true" },
    ],
    constraints: ["1 ≤ s.length ≤ 10^4", "s consists only of brackets."],
    hints: [
      "A stack naturally tracks the most recent unmatched opener.",
      "On a closing bracket, the top of the stack must be its matching opener.",
      "At the end the stack must be empty.",
    ],
    starter:
      "def is_valid(s):\n    pairs = {')': '(', ']': '[', '}': '{'}\n    stack = []\n    # TODO: push openers, match closers\n    return not stack\n\nprint(is_valid(\"()[]{}\"))  # expected True\nprint(is_valid(\"([)]\"))    # expected False",
  },

  "Binary Search": {
    func: "search",
    tests: [{ args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 }, { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 }, { args: [[5], 5], expected: 0 }],
    difficulty: "Easy",
    topic: "Binary Search",
    statement:
      "Given a sorted (ascending) array of distinct integers nums and a target, return the index of target, or -1 if it isn't present. Your solution must run in O(log n).",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^4", "nums is sorted ascending with distinct values."],
    hints: [
      "Keep a low and high pointer; look at the middle.",
      "If the middle is too small, search the right half; otherwise the left.",
    ],
    starter:
      "def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    # TODO: classic binary search\n    return -1\n\nprint(search([-1,0,3,5,9,12], 9))  # expected 4\nprint(search([-1,0,3,5,9,12], 2))  # expected -1",
  },

  "Reverse Linked List": {
    difficulty: "Easy",
    topic: "Linked List",
    statement:
      "Given the head of a singly linked list, reverse it and return the new head. Below, the list is represented as a Python list for easy testing.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
      { input: "head = []", output: "[]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 5000", "-5000 ≤ Node.val ≤ 5000"],
    hints: [
      "Walk the list keeping a prev pointer.",
      "At each node, point it back to prev, then advance both pointers.",
    ],
    starter:
      "def reverse_list(values):\n    # Using a Python list to stand in for the linked list\n    prev = []\n    # TODO: build the reversed order\n    return prev\n\nprint(reverse_list([1,2,3,4,5]))  # expected [5, 4, 3, 2, 1]",
  },

  "Merge Two Sorted Lists": {
    difficulty: "Easy",
    topic: "Linked List",
    statement:
      "You are given two sorted lists. Merge them into one sorted list and return it. (Represented here as Python lists for testing.)",
    examples: [
      { input: "l1 = [1,2,4], l2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "l1 = [], l2 = []", output: "[]" },
      { input: "l1 = [], l2 = [0]", output: "[0]" },
    ],
    constraints: ["0 ≤ each list length ≤ 50", "Both lists are sorted ascending."],
    hints: [
      "Use two pointers, one per list.",
      "Repeatedly take the smaller head until one list is exhausted, then append the rest.",
    ],
    starter:
      "def merge_two(l1, l2):\n    i = j = 0\n    out = []\n    # TODO: merge while comparing heads\n    return out\n\nprint(merge_two([1,2,4], [1,3,4]))  # expected [1,1,2,3,4,4]",
  },

  "Invert Binary Tree": {
    difficulty: "Easy",
    topic: "Trees",
    statement:
      "Invert a binary tree: swap the left and right child of every node. Below, the tree is given in level-order (BFS) as a list, with null for missing nodes; return the inverted tree in the same format.",
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
      { input: "root = [2,1,3]", output: "[2,3,1]" },
      { input: "root = []", output: "[]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 100", "-100 ≤ Node.val ≤ 100"],
    hints: [
      "Inverting = recursively swapping left and right subtrees.",
      "The base case is an empty subtree.",
    ],
    starter:
      "# Tip: think recursively — invert(left), invert(right), then swap.\ndef invert(node):\n    # node is a dict {'val':v,'left':..,'right':..} or None\n    # TODO: swap children recursively\n    return node\n\nprint('Build a small tree and test your invert() function')",
  },

  "Maximum Depth of Binary Tree": {
    difficulty: "Easy",
    topic: "Trees",
    statement:
      "Given a binary tree, return its maximum depth — the number of nodes along the longest path from the root down to the farthest leaf.",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
      { input: "root = [1,null,2]", output: "2" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 10^4", "-100 ≤ Node.val ≤ 100"],
    hints: ["Depth of a node = 1 + max(depth of left, depth of right).", "Empty subtree has depth 0."],
    starter:
      "def max_depth(node):\n    # node is a dict {'val','left','right'} or None\n    # TODO: 1 + max(depth(left), depth(right))\n    return 0\n\nprint('Test max_depth on a small tree')",
  },

  "Maximum Subarray": {
    func: "max_subarray",
    tests: [{ args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 }, { args: [[1]], expected: 1 }, { args: [[5, 4, -1, 7, 8]], expected: 23 }],
    difficulty: "Medium",
    topic: "Greedy",
    statement:
      "Given an integer array nums, find the contiguous subarray with the largest sum and return that sum. The subarray must contain at least one element.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] sums to 6." },
      { input: "nums = [1]", output: "1" },
      { input: "nums = [5,4,-1,7,8]", output: "23" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "-10^4 ≤ nums[i] ≤ 10^4"],
    hints: [
      "Kadane's idea: at each index, either extend the running sum or restart from the current value.",
      "Track the best sum seen so far.",
    ],
    starter:
      "def max_subarray(nums):\n    best = nums[0]\n    cur = nums[0]\n    # TODO: Kadane's algorithm\n    return best\n\nprint(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))  # expected 6",
  },

  "Climbing Stairs": {
    func: "climb_stairs",
    tests: [{ args: [2], expected: 2 }, { args: [3], expected: 3 }, { args: [5], expected: 8 }],
    difficulty: "Easy",
    topic: "Dynamic Programming",
    statement:
      "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1+1 or 2." },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1." },
      { input: "n = 5", output: "8" },
    ],
    constraints: ["1 ≤ n ≤ 45"],
    hints: [
      "Ways(n) = Ways(n-1) + Ways(n-2) — it's the Fibonacci sequence.",
      "Iterate bottom-up keeping just the last two values.",
    ],
    starter:
      "def climb_stairs(n):\n    a, b = 1, 1\n    # TODO: iterate up to n\n    return b\n\nprint(climb_stairs(2))  # expected 2\nprint(climb_stairs(3))  # expected 3\nprint(climb_stairs(5))  # expected 8",
  },

  "House Robber": {
    func: "rob",
    tests: [{ args: [[1, 2, 3, 1]], expected: 4 }, { args: [[2, 7, 9, 3, 1]], expected: 12 }, { args: [[2, 1, 1, 2]], expected: 4 }],
    difficulty: "Medium",
    topic: "Dynamic Programming",
    statement:
      "Houses are in a row, each with some money. You cannot rob two adjacent houses (alarms connect neighbors). Given an array nums of the money in each house, return the maximum you can rob.",
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 0 and 2 (1 + 3)." },
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob houses 0, 2, 4 (2 + 9 + 1)." },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 400"],
    hints: [
      "At each house: skip it (keep previous best) or rob it (best from two houses back + this).",
      "Carry two running values instead of a full array.",
    ],
    starter:
      "def rob(nums):\n    prev, cur = 0, 0\n    # TODO: cur = max(cur, prev + n) pattern\n    return cur\n\nprint(rob([1,2,3,1]))     # expected 4\nprint(rob([2,7,9,3,1]))   # expected 12",
  },

  "Coin Change": {
    func: "coin_change",
    tests: [{ args: [[1, 2, 5], 11], expected: 3 }, { args: [[2], 3], expected: -1 }, { args: [[1], 0], expected: 0 }],
    difficulty: "Medium",
    topic: "Dynamic Programming",
    statement:
      "Given coin denominations coins and a target amount, return the fewest coins needed to make that amount. If it can't be made, return -1. You have an unlimited supply of each coin.",
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "5 + 5 + 1." },
      { input: "coins = [2], amount = 3", output: "-1" },
      { input: "coins = [1], amount = 0", output: "0" },
    ],
    constraints: ["1 ≤ coins.length ≤ 12", "0 ≤ amount ≤ 10^4"],
    hints: [
      "dp[x] = fewest coins to make x.",
      "dp[x] = min over coins c of dp[x - c] + 1.",
      "Initialize dp[0] = 0 and the rest to infinity.",
    ],
    starter:
      "def coin_change(coins, amount):\n    INF = float('inf')\n    dp = [0] + [INF] * amount\n    # TODO: fill dp bottom-up\n    return -1 if dp[amount] == INF else dp[amount]\n\nprint(coin_change([1,2,5], 11))  # expected 3\nprint(coin_change([2], 3))       # expected -1",
  },

  "Number of Islands": {
    func: "num_islands",
    tests: [{ args: [[["1", "1", "0"], ["1", "0", "0"], ["0", "0", "1"]]], expected: 2 }, { args: [[["1", "1", "1"], ["1", "1", "1"]]], expected: 1 }],
    difficulty: "Medium",
    topic: "Graphs",
    statement:
      "Given a 2-D grid of '1' (land) and '0' (water), count the number of islands. An island is land connected horizontally or vertically (not diagonally). The grid edges are surrounded by water.",
    examples: [
      { input: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]', output: "2" },
      { input: 'grid = [["1","1","1"],["1","1","1"]]', output: "1" },
    ],
    constraints: ["1 ≤ rows, cols ≤ 300", "Each cell is '0' or '1'."],
    hints: [
      "Scan every cell; when you hit unvisited land, that's a new island.",
      "Flood-fill (DFS/BFS) that island, marking visited cells so you don't recount.",
    ],
    starter:
      "def num_islands(grid):\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    # TODO: DFS/BFS flood fill from each unvisited '1'\n    return count\n\nprint(num_islands([[\"1\",\"1\",\"0\"],[\"1\",\"0\",\"0\"],[\"0\",\"0\",\"1\"]]))  # expected 2",
  },

  "Single Number": {
    func: "single_number",
    tests: [{ args: [[2, 2, 1]], expected: 1 }, { args: [[4, 1, 2, 1, 2]], expected: 4 }, { args: [[1]], expected: 1 }],
    difficulty: "Easy",
    topic: "Bit Manipulation",
    statement:
      "Every element in nums appears exactly twice except for one that appears once. Find the single one using O(n) time and O(1) extra space.",
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 3 × 10^4", "Each element appears twice except one."],
    hints: [
      "XOR of a number with itself is 0, and XOR with 0 leaves it unchanged.",
      "XOR everything together — the pairs cancel out.",
    ],
    starter:
      "def single_number(nums):\n    result = 0\n    # TODO: XOR all values\n    return result\n\nprint(single_number([4,1,2,1,2]))  # expected 4",
  },

  "Number of 1 Bits": {
    func: "hamming_weight",
    tests: [{ args: [11], expected: 3 }, { args: [128], expected: 1 }, { args: [7], expected: 3 }],
    difficulty: "Easy",
    topic: "Bit Manipulation",
    statement:
      "Given a non-negative integer n, return how many '1' bits it has in its binary representation (its Hamming weight).",
    examples: [
      { input: "n = 11", output: "3", explanation: "1011 has three set bits." },
      { input: "n = 128", output: "1", explanation: "10000000 has one set bit." },
    ],
    constraints: ["0 ≤ n ≤ 2^31 - 1"],
    hints: [
      "n & (n - 1) clears the lowest set bit.",
      "Count how many times you can do that before n becomes 0.",
    ],
    starter:
      "def hamming_weight(n):\n    count = 0\n    # TODO: count set bits (try n &= n - 1)\n    return count\n\nprint(hamming_weight(11))   # expected 3\nprint(hamming_weight(128))  # expected 1",
  },

  "Longest Consecutive Sequence": {
    func: "longest_consecutive",
    tests: [{ args: [[100, 4, 200, 1, 3, 2]], expected: 4 }, { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 }, { args: [[]], expected: 0 }],
    difficulty: "Medium",
    topic: "Arrays & Hashing",
    statement:
      "Given an unsorted array of integers nums, return the length of the longest run of consecutive integers (e.g. 1,2,3,4). Your solution should run in O(n).",
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "The run 1,2,3,4 has length 4." },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
    ],
    constraints: ["0 ≤ nums.length ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9"],
    hints: [
      "Put everything in a set for O(1) lookups.",
      "Only start counting a run from numbers that have no left neighbor (n-1 not in set).",
    ],
    starter:
      "def longest_consecutive(nums):\n    s = set(nums)\n    best = 0\n    # TODO: start runs only at sequence beginnings\n    return best\n\nprint(longest_consecutive([100,4,200,1,3,2]))  # expected 4",
  },
};

// Optimal (target) time & space complexity per problem — shown on the problem page.
export const complexities = {
  "Two Sum": { time: "O(n)", space: "O(n)" },
  "Contains Duplicate": { time: "O(n)", space: "O(n)" },
  "Group Anagrams": { time: "O(n·k)", space: "O(n·k)" },
  "Top K Frequent Elements": { time: "O(n)", space: "O(n)" },
  "Product of Array Except Self": { time: "O(n)", space: "O(1)" },
  "Valid Palindrome": { time: "O(n)", space: "O(1)" },
  "3Sum": { time: "O(n²)", space: "O(1)" },
  "Container With Most Water": { time: "O(n)", space: "O(1)" },
  "Best Time to Buy and Sell Stock": { time: "O(n)", space: "O(1)" },
  "Valid Parentheses": { time: "O(n)", space: "O(n)" },
  "Binary Search": { time: "O(log n)", space: "O(1)" },
  "Reverse Linked List": { time: "O(n)", space: "O(1)" },
  "Merge Two Sorted Lists": { time: "O(n + m)", space: "O(1)" },
  "Invert Binary Tree": { time: "O(n)", space: "O(h)" },
  "Maximum Depth of Binary Tree": { time: "O(n)", space: "O(h)" },
  "Maximum Subarray": { time: "O(n)", space: "O(1)" },
  "Climbing Stairs": { time: "O(n)", space: "O(1)" },
  "House Robber": { time: "O(n)", space: "O(1)" },
  "Coin Change": { time: "O(n·A)", space: "O(A)" },
  "Number of Islands": { time: "O(m·n)", space: "O(m·n)" },
  "Single Number": { time: "O(n)", space: "O(1)" },
  "Number of 1 Bits": { time: "O(1)", space: "O(1)" },
  "Longest Consecutive Sequence": { time: "O(n)", space: "O(n)" },
};
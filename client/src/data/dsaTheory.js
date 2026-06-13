
export const dsaTheory = [
  {
    id: "arrays",
    subtopics: [["1-D arrays", "Contiguous storage with O(1) index access; the base for almost everything else."], ["Multidimensional / matrices", "Row-major storage; traversal patterns \u2014 row, column, diagonal, spiral \u2014 and in-place 90\u00b0 rotation."], ["Dynamic arrays (amortized growth)", "Auto-resizing by doubling capacity gives amortized O(1) append (Python list, Java ArrayList, C++ vector)."], ["Prefix sums", "Precompute cumulative sums for O(1) range-sum queries; 2-D prefix sums answer submatrix sums."], ["Difference arrays", "Apply many range updates in O(1) each, then rebuild once for the final values."], ["Hash map (dictionary)", "Key\u2192value in ~O(1); collisions via chaining or open addressing; resize when load factor grows."], ["Hash set", "Stores unique values for ~O(1) membership tests and de-duplication."], ["Frequency counting", "A count map (Counter) powers anagrams, top-K, and majority-element problems."], ["Hashing pitfalls", "Bad hashing degrades to O(n); keys must be immutable/hashable; iteration order isn't guaranteed."]],
    types: [["Static array", "Fixed size set at creation (e.g. C arrays)."], ["Dynamic array", "Grows/shrinks automatically \u2014 Python list, Java ArrayList, JS Array."], ["Multidimensional / matrix", "2D+ grids indexed by row and column."], ["Hash map", "Key\u2192value store with ~O(1) lookup (dict / HashMap)."], ["Hash set", "Unique values only, ~O(1) membership test."]],
    title: "Arrays & Hashing",
    summary: "Contiguous memory + O(1) hash lookups — the backbone of most problems.",
    sections: [
      { h: "What it is", body: "An array stores elements in contiguous memory, so any index can be reached in O(1) by computing base + i × size. A hash map (dictionary) stores key→value pairs and, using a hash function, also gives ~O(1) average lookup, insert, and delete." },
      { h: "When to use it", body: "Use arrays when you need ordered, index-based access or you'll iterate in order. Reach for a hash map the moment you find yourself asking “have I seen this value/key before?” or “how many times does X appear?” — it turns an O(n²) nested scan into O(n)." },
      { h: "How it works", body: "A hash map hashes the key into a bucket index. Good hashing spreads keys evenly; collisions are handled by chaining (linked lists) or open addressing. Average operations are O(1); worst case O(n) if many keys collide." },
    ],
    complexity: [["Index access", "O(1)"], ["Search (unsorted)", "O(n)"], ["Insert/delete at end", "O(1)*"], ["Insert/delete middle", "O(n)"], ["Hash get/set/has", "O(1) avg"]],
    examples: [
      { lang: "Python", code: `# Two Sum in O(n): remember each number's index in a hash map
def two_sum(nums, target):
    seen = {}                 # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:       # O(1) average lookup
            return [seen[need], i]
        seen[x] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]` },
      { lang: "JavaScript", code: `function twoSum(nums, target) {
  const seen = new Map();              // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]` },
      { lang: "Java", code: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}` },
      { lang: "C++", code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}` },
    ],
    tips: [
      "A hash map trades memory for speed — O(n) extra space to drop a time complexity.",
      "Use a frequency map (Counter) for “count occurrences” / anagram problems.",
      "Prefix sums let you answer range-sum queries in O(1) after O(n) setup.",
    ],
  },
  {
    id: "twopointers",
    subtopics: [["Opposite-ends pointers", "lo and hi move inward \u2014 sorted pair/triplet sums, container-with-most-water, palindromes."], ["Fast & slow (Floyd's)", "Two speeds detect a cycle, find its start, and locate the middle of a list."], ["Read/write (in-place)", "One pointer reads, one writes \u2014 remove element, dedup sorted array, move zeroes."], ["Merge of two sorted sequences", "Walk both with one pointer each to merge in O(n)."], ["Dutch national flag", "Three pointers partition into <, =, > a pivot in one pass (sort colors)."], ["k-difference pairs", "A sliding pair over sorted data finds pairs with a target difference."]],
    types: [["Opposite ends", "Pointers start at both ends and move inward (pair sums, palindromes)."], ["Fast & slow", "Same start, different speeds (cycle detection, find middle)."], ["Read / write", "One pointer writes, one reads (in-place removal & dedup)."]],
    title: "Two Pointers",
    summary: "Two indices moving through data to avoid a nested loop.",
    sections: [
      { h: "What it is", body: "A technique that uses two indices — often one at each end, or a slow/fast pair — that move toward each other or in the same direction based on a condition." },
      { h: "When to use it", body: "Sorted arrays, palindrome checks, pair/triplet sums, removing duplicates in place, or detecting cycles. It usually replaces an O(n²) brute force with O(n)." },
      { h: "How it works", body: "Opposite-ends: start lo=0, hi=n-1; compare and move the pointer that can improve the answer. Same-direction (slow/fast): the fast pointer scans ahead while slow marks a boundary you build up." },
    ],
    complexity: [["Time", "O(n)"], ["Space", "O(1)"]],
    examples: [
      { lang: "Python", code: `# Pair that sums to target in a SORTED array
def pair_sum(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return (lo, hi)
        if s < target:
            lo += 1     # need a bigger sum
        else:
            hi -= 1     # need a smaller sum
    return None

print(pair_sum([1, 3, 4, 6, 8, 11], 10))  # (2, 3) -> 4 + 6` },
      { lang: "JavaScript", code: `function pairSum(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const s = nums[lo] + nums[hi];
    if (s === target) return [lo, hi];
    if (s < target) lo++; else hi--;
  }
  return null;
}
console.log(pairSum([1, 3, 4, 6, 8, 11], 10)); // [2, 3]` },
      { lang: "Java", code: `int[] pairSum(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int s = nums[lo] + nums[hi];
        if (s == target) return new int[]{lo, hi};
        if (s < target) lo++; else hi--;
    }
    return null;
}` },
      { lang: "C++", code: `vector<int> pairSum(vector<int>& a, int target) {
    int lo = 0, hi = a.size() - 1;
    while (lo < hi) {
        int s = a[lo] + a[hi];
        if (s == target) return {lo, hi};
        if (s < target) lo++; else hi--;
    }
    return {};
}` },
    ],
    tips: [
      "The array usually must be sorted first (sorting is O(n log n)).",
      "Slow/fast pointers detect linked-list cycles (Floyd's algorithm).",
      "For 3Sum, fix one element and two-pointer the rest.",
    ],
  },
  {
    id: "sliding",
    subtopics: [["Fixed-size window", "Length k stays constant \u2014 running sum/average, first negative in window."], ["Variable-size window", "Grow/shrink to satisfy a constraint \u2014 longest substring without repeats, min window."], ["At most K / exactly K", "'Exactly K' = atMost(K) \u2212 atMost(K\u22121) \u2014 a common counting trick."], ["Window with a frequency map", "Track character counts for anagrams and character-replacement problems."], ["Monotonic deque window", "A deque keeps the window's max/min in O(1) amortized (sliding window maximum)."]],
    types: [["Fixed-size window", "Window length k stays constant (max sum of k elements)."], ["Variable-size window", "Window grows/shrinks to satisfy a constraint (longest substring)."]],
    title: "Sliding Window",
    summary: "A moving sub-range over a sequence to track a running best.",
    sections: [
      { h: "What it is", body: "Maintain a window [left, right] over an array/string and slide it, expanding the right edge and shrinking the left edge while keeping some running state (sum, count, frequency map)." },
      { h: "When to use it", body: "“Longest/shortest/maximum substring or subarray that satisfies a condition.” Fixed-size windows (average of every k elements) and variable-size windows (longest substring without repeats)." },
      { h: "How it works", body: "Grow the window by moving right and updating state. When the window violates the constraint, shrink from the left until it's valid again. Each element enters and leaves the window at most once → O(n)." },
    ],
    complexity: [["Time", "O(n)"], ["Space", "O(k) or O(charset)"]],
    examples: [
      { lang: "Python", code: `# Longest substring without repeating characters
def longest_unique(s):
    last = {}            # char -> last index seen
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1     # jump past the repeat
        last[ch] = right
        best = max(best, right - left + 1)
    return best

print(longest_unique("abcabcbb"))  # 3  ("abc")` },
      { lang: "JavaScript", code: `function longestUnique(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    if (last.has(c) && last.get(c) >= left) left = last.get(c) + 1;
    last.set(c, r);
    best = Math.max(best, r - left + 1);
  }
  return best;
}
console.log(longestUnique("abcabcbb")); // 3` },
      { lang: "Java", code: `int longestUnique(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int left = 0, best = 0;
    for (int r = 0; r < s.length(); r++) {
        char c = s.charAt(r);
        if (last.containsKey(c) && last.get(c) >= left) left = last.get(c) + 1;
        last.put(c, r);
        best = Math.max(best, r - left + 1);
    }
    return best;
}` },
      { lang: "C++", code: `int longestUnique(string s) {
    unordered_map<char, int> last;
    int left = 0, best = 0;
    for (int r = 0; r < (int)s.size(); r++) {
        char c = s[r];
        if (last.count(c) && last[c] >= left) left = last[c] + 1;
        last[c] = r;
        best = max(best, r - left + 1);
    }
    return best;
}` },
    ],
    tips: [
      "Fixed window: add the new element, remove the one that fell off.",
      "Variable window: a while-loop shrinks left until valid.",
      "Track window state in a hash map or counter, not by re-scanning.",
    ],
  },
  {
    id: "stackqueue",
    subtopics: [["Array-backed stack", "push / pop / peek at one end in O(1)."], ["Monotonic stack", "Maintains increasing/decreasing order for next-greater/smaller, histogram, daily temperatures."], ["Expression evaluation", "Infix\u2192postfix (shunting-yard) and evaluating Reverse Polish Notation."], ["Min / Max stack", "Track the running minimum/maximum alongside the stack in O(1)."], ["Queue (FIFO)", "Enqueue at back, dequeue at front \u2014 use a deque for O(1) both ends."], ["Circular queue / ring buffer", "Fixed-size buffer that wraps around, reusing freed slots."], ["Deque", "Double-ended queue; insert/remove at both ends."], ["Stack\u2194Queue simulation", "A queue from two stacks, or a stack from two queues."]],
    types: [["Stack (LIFO)", "Push and pop at one end."], ["Simple queue (FIFO)", "Enqueue at the back, dequeue at the front."], ["Circular queue", "Reuses freed front slots in a fixed-size buffer."], ["Deque", "Insert and remove at BOTH ends."], ["Priority queue", "Serves the highest/lowest priority first (heap-backed)."]],
    title: "Stack & Queue",
    summary: "LIFO and FIFO containers that model order of processing.",
    sections: [
      { h: "What it is", body: "A stack is Last-In-First-Out (push/pop at one end). A queue is First-In-First-Out (enqueue at back, dequeue at front). Both give O(1) ends operations." },
      { h: "When to use it", body: "Stack: matching brackets, undo, evaluating expressions, monotonic-stack problems (next greater element), DFS. Queue: BFS, scheduling, streaming, level-order traversal." },
      { h: "How it works", body: "A stack is naturally a dynamic array (append/pop). A queue is best as a deque (double-ended queue) so both ends are O(1) — a plain list popping from the front is O(n)." },
    ],
    complexity: [["push / pop", "O(1)"], ["enqueue / dequeue", "O(1)"], ["peek", "O(1)"], ["search", "O(n)"]],
    examples: [
      { lang: "Python", code: `from collections import deque

# Valid parentheses with a stack
def valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for c in s:
        if c in '([{':
            stack.append(c)
        elif not stack or stack.pop() != pairs[c]:
            return False
    return not stack

q = deque([1, 2, 3])   # use deque for O(1) FIFO
q.append(4); q.popleft()
print(valid("([]{})"), list(q))  # True [2, 3, 4]` },
      { lang: "JavaScript", code: `function valid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const c of s) {
    if ("([{".includes(c)) stack.push(c);
    else if (stack.pop() !== pairs[c]) return false;
  }
  return stack.length === 0;
}
console.log(valid("([]{})")); // true` },
      { lang: "Java", code: `boolean valid(String s) {
    Map<Character, Character> p = Map.of(')', '(', ']', '[', '}', '{');
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else if (st.isEmpty() || st.pop() != p.get(c)) return false;
    }
    return st.isEmpty();
}` },
      { lang: "C++", code: `bool valid(string s) {
    unordered_map<char, char> p = {{')','('},{']','['},{'}','{'}};
    stack<char> st;
    for (char c : s) {
        if (c=='('||c=='['||c=='{') st.push(c);
        else { if (st.empty() || st.top() != p[c]) return false; st.pop(); }
    }
    return st.empty();
}` },
    ],
    tips: [
      "Use collections.deque for queues — list.pop(0) is O(n).",
      "A monotonic stack keeps elements in sorted order for next-greater/smaller problems.",
      "Two stacks can simulate a queue (and vice-versa).",
    ],
  },
  {
    id: "linkedlist",
    subtopics: [["Singly linked list", "insert / delete / search / traverse with a single next pointer."], ["Doubly linked list", "next and prev pointers enable O(1) deletion given a node (LRU cache)."], ["Circular linked list", "Tail links back to head \u2014 round-robin scheduling."], ["Reversal", "Iterative and recursive reversal; reverse in groups of k."], ["Fast & slow pointers", "Find the middle, detect a cycle, and find the cycle's entry node."], ["Merging lists", "Merge two sorted lists; merge k lists with a heap."], ["Dummy / sentinel node", "A node before head removes head-change edge cases."], ["LRU cache", "Hash map + doubly linked list gives O(1) get and put."]],
    types: [["Singly linked", "Each node points to the next only."], ["Doubly linked", "Nodes point to next AND previous \u2014 easy backward traversal."], ["Circular linked", "The last node points back to the head (round-robin)."], ["Doubly circular", "Doubly linked and circular \u2014 used in LRU caches."]],
    title: "Linked Lists",
    summary: "Nodes connected by pointers — O(1) insert/delete, no random access.",
    sections: [
      { h: "What it is", body: "A chain of nodes where each node holds a value and a pointer to the next (and possibly previous) node. There's no contiguous memory and no O(1) indexing." },
      { h: "When to use it", body: "When you insert/delete frequently at known positions (O(1) re-linking) and don't need random access. Foundational for LRU caches, adjacency lists, and as a building block in other structures." },
      { h: "How it works", body: "Keep a head pointer. A dummy/sentinel node before the head removes annoying edge cases when the head itself changes. Reversal flips each node's next pointer one at a time." },
    ],
    complexity: [["Access by index", "O(n)"], ["Insert/delete (have node)", "O(1)"], ["Search", "O(n)"], ["Space", "O(n)"]],
    examples: [
      { lang: "Python", code: `class Node:
    def __init__(self, val, nxt=None):
        self.val, self.next = val, nxt

# Reverse a singly linked list in place
def reverse(head):
    prev = None
    while head:
        nxt = head.next   # save next
        head.next = prev  # flip pointer
        prev = head       # advance prev
        head = nxt        # advance head
    return prev           # new head

# build 1->2->3, reverse -> 3->2->1` },
      { lang: "JavaScript", code: `function reverse(head) {
  let prev = null;
  while (head) {
    const nxt = head.next; // save next
    head.next = prev;      // flip pointer
    prev = head;           // advance prev
    head = nxt;            // advance head
  }
  return prev;             // new head
}` },
      { lang: "Java", code: `ListNode reverse(ListNode head) {
    ListNode prev = null;
    while (head != null) {
        ListNode nxt = head.next;
        head.next = prev;
        prev = head;
        head = nxt;
    }
    return prev;
}` },
      { lang: "C++", code: `ListNode* reverse(ListNode* head) {
    ListNode* prev = nullptr;
    while (head) {
        ListNode* nxt = head->next;
        head->next = prev;
        prev = head;
        head = nxt;
    }
    return prev;
}` },
    ],
    tips: [
      "A dummy head node simplifies insert/delete at the front.",
      "Slow/fast pointers find the middle and detect cycles.",
      "Always save node.next before you overwrite it.",
    ],
  },
  {
    id: "binarysearch",
    subtopics: [["Classic exact search", "Find a target index in a sorted array."], ["Lower / upper bound", "First index \u2265 x, or first index > x (bisect_left / bisect_right)."], ["First / last occurrence", "Boundaries of a repeated value."], ["Rotated sorted array", "Decide which half is sorted, then recurse into the right side."], ["Binary search on the answer", "Search the numeric answer when feasibility is monotonic \u2014 Koko bananas, ship capacity, split array."], ["Search a 2-D matrix", "Treat the sorted matrix as one flattened array."], ["Peak finding", "Move toward the higher neighbour to find a local peak in O(log n)."], ["Floating-point search", "Fixed iteration count or an epsilon tolerance for real-valued answers."]],
    types: [["Exact match", "Find one specific value."], ["Lower / upper bound", "First or last index \u2265 or > a value (boundaries)."], ["Search on the answer", "Binary-search the numeric answer when feasibility is monotonic."]],
    title: "Binary Search",
    summary: "Halve the search space each step — O(log n) on sorted data.",
    sections: [
      { h: "What it is", body: "Repeatedly compare the target with the middle of a sorted range and discard the half that can't contain the answer." },
      { h: "When to use it", body: "Searching sorted arrays, finding boundaries (first/last position), and “search on the answer” — when the answer is monotonic, binary-search the value itself (e.g., minimum capacity, Koko eating bananas)." },
      { h: "How it works", body: "Maintain lo and hi. mid = lo + (hi - lo) // 2 (avoids overflow). Shrink lo or hi based on the comparison. The loop invariant — what's guaranteed about lo/hi — is what makes it correct." },
    ],
    complexity: [["Time", "O(log n)"], ["Space", "O(1)"]],
    examples: [
      { lang: "Python", code: `# Classic binary search -> index or -1
def bsearch(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(bsearch([1, 3, 5, 7, 9, 11], 7))  # 3` },
      { lang: "JavaScript", code: `function bsearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
console.log(bsearch([1, 3, 5, 7, 9, 11], 7)); // 3` },
      { lang: "Java", code: `int bsearch(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}` },
      { lang: "C++", code: `int bsearch(vector<int>& a, int target) {
    int lo = 0, hi = a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}` },
    ],
    tips: [
      "Use lo + (hi - lo)//2 to avoid integer overflow in other languages.",
      "Decide <= vs < and mid±1 carefully — off-by-one is the #1 bug.",
      "“Search on the answer” works when feasibility is monotonic.",
    ],
  },
  {
    id: "trees",
    subtopics: [["Terminology", "Root, leaf, height, depth; full / complete / perfect binary trees."], ["DFS traversals", "Pre-order, in-order, post-order \u2014 recursive and iterative (stack)."], ["BFS / level-order", "A queue visits the tree level by level."], ["Binary search tree (BST)", "Ordered structure; search/insert/delete in O(h); in-order yields sorted output."], ["Balanced BSTs", "AVL (rotation-balanced) and Red-Black trees (Java TreeMap, C++ std::map) keep height ~log n."], ["Heap (as a tree)", "Complete tree with the heap order property (see Heaps topic)."], ["Trie", "Character-keyed tree for prefixes (see Tries topic)."], ["Segment tree", "Range query + range/point update in O(log n)."], ["Fenwick tree (BIT)", "Prefix sums with point updates in O(log n), very compact."], ["Lowest common ancestor (LCA)", "Binary lifting or Euler tour + sparse table for fast ancestor queries."], ["Morris traversal", "In-order traversal in O(1) extra space using threaded links."]],
    types: [["Binary tree", "Each node has at most 2 children."], ["Binary search tree (BST)", "Ordered: left < node < right."], ["Balanced BST (AVL / Red-Black)", "Self-balancing to keep height ~log n."], ["Heap", "Complete tree with parent \u2264/\u2265 children."], ["Trie", "Prefix tree keyed by characters."], ["N-ary tree", "Any number of children (file systems, the DOM)."], ["Segment / Fenwick tree", "Fast range queries and updates."]],
    title: "Trees & Binary Search Trees",
    summary: "Hierarchical nodes; a BST keeps left < node < right for O(log n) ops.",
    sections: [
      { h: "What it is", body: "A tree is a connected, acyclic graph with a root; each node has children. A binary tree has ≤2 children. A Binary Search Tree (BST) maintains the invariant left subtree < node < right subtree." },
      { h: "When to use it", body: "Hierarchies (file systems, org charts), ordered data with fast insert/search (BST/balanced trees), prefix problems (tries), and range queries (segment/Fenwick trees)." },
      { h: "How it works", body: "Traverse with DFS (pre/in/post-order, usually recursion) or BFS (level-order, a queue). In a BST, in-order traversal yields sorted order, and search walks left/right by comparison." },
    ],
    complexity: [["BST search/insert (balanced)", "O(log n)"], ["BST worst (skewed)", "O(n)"], ["Traversal", "O(n)"], ["Space (recursion)", "O(h)"]],
    examples: [
      { lang: "Python", code: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val, self.left, self.right = val, left, right

# Validate a BST using allowed (low, high) bounds
def is_bst(node, low=float('-inf'), high=float('inf')):
    if not node:
        return True
    if not (low < node.val < high):
        return False
    return (is_bst(node.left, low, node.val) and
            is_bst(node.right, node.val, high))` },
      { lang: "JavaScript", code: `function isBST(node, low = -Infinity, high = Infinity) {
  if (!node) return true;
  if (!(low < node.val && node.val < high)) return false;
  return isBST(node.left, low, node.val) &&
         isBST(node.right, node.val, high);
}` },
      { lang: "Java", code: `boolean isBST(TreeNode n, long low, long high) {
    if (n == null) return true;
    if (!(low < n.val && n.val < high)) return false;
    return isBST(n.left, low, n.val) && isBST(n.right, n.val, high);
}
// call: isBST(root, Long.MIN_VALUE, Long.MAX_VALUE)` },
      { lang: "C++", code: `bool isBST(TreeNode* n, long low = LONG_MIN, long high = LONG_MAX) {
    if (!n) return true;
    if (!(low < n->val && n->val < high)) return false;
    return isBST(n->left, low, n->val) && isBST(n->right, n->val, high);
}` },
    ],
    tips: [
      "In-order traversal of a BST is sorted — handy for validation.",
      "Recursion depth is O(height); balance keeps height ~log n.",
      "BFS (queue) for level-order / shortest path in unweighted trees.",
    ],
  },
  {
    id: "tries",
    subtopics: [["Standard trie", "insert / search / startsWith, one node per character."], ["Word-end marker", "A boolean (or sentinel key) distinguishes a full word from a prefix."], ["Compressed trie (radix tree)", "Merges single-child chains to save memory."], ["Suffix trie / tree", "Stores all suffixes for fast substring and pattern queries."], ["Binary (bitwise) trie", "Bits as edges \u2014 finds the maximum XOR pair in O(32\u00b7n)."], ["Applications", "Autocomplete, spell-check, longest-prefix IP routing, word-search-on-grid."]],
    types: [["Standard trie", "One node per character."], ["Compressed trie (radix)", "Merges single-child chains to save space."], ["Suffix trie / tree", "Stores all suffixes for fast substring search."]],
    title: "Tries (Prefix Trees)",
    summary: "Tree keyed by characters for fast prefix and word lookups.",
    sections: [
      { h: "What it is", body: "A tree where each edge is a character and each root-to-node path spells a prefix. A flag marks the end of a complete word." },
      { h: "When to use it", body: "Autocomplete, spell-check, prefix search, IP routing, and word-search-on-a-grid problems. Lookups depend on word length, not the number of words stored." },
      { h: "How it works", body: "Each node holds a map child-char→node and an is_word flag. Insert walks/creates nodes per character; search follows them; prefix search stops early without needing is_word." },
    ],
    complexity: [["Insert", "O(L)"], ["Search", "O(L)"], ["Prefix check", "O(L)"], ["Space", "O(total chars)"]],
    examples: [
      { lang: "Python", code: `class Trie:
    def __init__(self):
        self.root = {}            # nested dicts; '#' marks word end
    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = True
    def search(self, word, prefix=False):
        node = self.root
        for ch in word:
            if ch not in node:
                return False
            node = node[ch]
        return True if prefix else '#' in node

t = Trie(); t.insert("cat")
print(t.search("ca", prefix=True), t.search("cat"))  # True True` },
      { lang: "JavaScript", code: `class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let node = this.root;
    for (const ch of word) node = (node[ch] ??= {});
    node.end = true;
  }
  search(word, prefix = false) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) return false;
      node = node[ch];
    }
    return prefix ? true : !!node.end;
  }
}` },
      { lang: "Java", code: `class Trie {
    Map<Character, Trie> kids = new HashMap<>();
    boolean end;
    void insert(String w) {
        Trie n = this;
        for (char c : w.toCharArray())
            n = n.kids.computeIfAbsent(c, k -> new Trie());
        n.end = true;
    }
    boolean search(String w, boolean prefix) {
        Trie n = this;
        for (char c : w.toCharArray()) {
            n = n.kids.get(c);
            if (n == null) return false;
        }
        return prefix || n.end;
    }
}` },
      { lang: "C++", code: `struct Trie {
    unordered_map<char, Trie*> kids;
    bool end = false;
    void insert(const string& w) {
        Trie* n = this;
        for (char c : w) {
            if (!n->kids.count(c)) n->kids[c] = new Trie();
            n = n->kids[c];
        }
        n->end = true;
    }
    bool search(const string& w, bool prefix) {
        Trie* n = this;
        for (char c : w) {
            if (!n->kids.count(c)) return false;
            n = n->kids[c];
        }
        return prefix || n->end;
    }
};` },
    ],
    tips: [
      "L = word length; tries beat hashing when you need prefixes.",
      "Use a sentinel key (e.g. '#') or a boolean flag for word ends.",
      "Combine a trie with DFS for Word Search II on a grid.",
    ],
  },
  {
    id: "heaps",
    subtopics: [["Min-heap / max-heap", "Smallest or largest element always sits at the root."], ["Array representation", "Node i has children 2i+1 and 2i+2, parent (i\u22121)/2 \u2014 no pointers needed."], ["sift-up / sift-down", "Insert bubbles up; pop moves the last element to the root then sinks it down."], ["build-heap (heapify)", "Heapify an array in O(n), faster than n inserts."], ["Heap sort", "Build a heap, then repeatedly extract the root \u2014 in-place O(n log n)."], ["Top-K pattern", "A size-k heap finds the k largest/smallest in O(n log k)."], ["Two-heap median", "A max-heap (lower half) + min-heap (upper half) gives a running median."], ["k-way merge", "A heap of list heads merges k sorted lists efficiently."], ["Advanced heaps", "Binomial, Fibonacci, and pairing heaps offer faster merge / decrease-key."]],
    types: [["Min-heap", "Smallest element sits at the root."], ["Max-heap", "Largest element sits at the root."], ["Binary heap", "The common array-backed heap."], ["Binomial / Fibonacci heap", "Advanced heaps with faster merge / decrease-key."]],
    title: "Heaps / Priority Queue",
    summary: "Binary heap giving O(log n) insert and O(1) peek of min/max.",
    sections: [
      { h: "What it is", body: "A complete binary tree (stored in an array) where every parent is ≤ its children (min-heap) or ≥ (max-heap). The smallest/largest is always at the root." },
      { h: "When to use it", body: "Top-K elements, merging k sorted lists, streaming medians (two heaps), Dijkstra's shortest path, and any “always grab the best next item” scheduling." },
      { h: "How it works", body: "Insert appends then “bubbles up”; pop removes the root, moves the last element to the top, then “sifts down”. Both are O(log n) because the tree height is log n." },
    ],
    complexity: [["push", "O(log n)"], ["pop min/max", "O(log n)"], ["peek", "O(1)"], ["heapify", "O(n)"]],
    examples: [
      { lang: "Python", code: `import heapq

# K largest elements using a min-heap of size k
def k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)   # drop the smallest
    return sorted(heap, reverse=True)

print(k_largest([3, 1, 5, 12, 2, 11], 3))  # [12, 11, 5]` },
      { lang: "JavaScript", code: `// JS has no built-in heap — sort-based k-largest for clarity.
// In interviews, implement a binary heap or use a library.
function kLargest(nums, k) {
  return [...nums].sort((a, b) => b - a).slice(0, k);
}
console.log(kLargest([3, 1, 5, 12, 2, 11], 3)); // [12, 11, 5]` },
      { lang: "Java", code: `int[] kLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(); // min-heap
    for (int x : nums) {
        heap.offer(x);
        if (heap.size() > k) heap.poll(); // drop smallest
    }
    int[] res = new int[k];
    for (int i = k - 1; i >= 0; i--) res[i] = heap.poll();
    return res;
}` },
      { lang: "C++", code: `vector<int> kLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> heap; // min-heap
    for (int x : nums) {
        heap.push(x);
        if ((int)heap.size() > k) heap.pop();
    }
    vector<int> res;
    while (!heap.empty()) { res.push_back(heap.top()); heap.pop(); }
    reverse(res.begin(), res.end());
    return res;
}` },
    ],
    tips: [
      "Python's heapq is a min-heap; push negatives for a max-heap.",
      "Top-K: keep a heap of size k → O(n log k).",
      "Two heaps (max-heap + min-heap) maintain a running median.",
    ],
  },
  {
    id: "graphs",
    subtopics: [["Representations", "Adjacency list (sparse), adjacency matrix (dense), and edge list."], ["BFS", "Queue-based; shortest path in unweighted graphs, level order, bipartite check."], ["DFS", "Stack/recursion; connectivity, path finding, cycle detection."], ["Topological sort", "Order a DAG's dependencies via Kahn's algorithm (BFS) or DFS finish times."], ["Union-Find (DSU)", "Path compression + union by rank give near-O(1) connectivity queries."], ["Dijkstra", "Single-source shortest path with non-negative weights using a min-heap."], ["Bellman-Ford", "Handles negative edges and detects negative cycles in O(V\u00b7E)."], ["Floyd-Warshall", "All-pairs shortest paths in O(V\u00b3) via dynamic programming."], ["0-1 BFS", "Deque-based shortest path when edge weights are only 0 or 1."], ["Minimum spanning tree", "Kruskal (sort edges + DSU) and Prim (grow via a heap)."], ["Strongly connected components", "Tarjan's (one DFS) or Kosaraju's (two DFS) on directed graphs."], ["Bridges & articulation points", "Low-link values find critical edges/nodes."]],
    types: [["Directed vs undirected", "Edges have a direction, or go both ways."], ["Weighted vs unweighted", "Edges carry a cost, or not."], ["Cyclic vs acyclic (DAG)", "Has cycles, or none \u2014 DAGs enable topological sort."], ["Connected / disconnected", "All nodes reachable, or split into components."], ["Adjacency list vs matrix", "Two storage formats \u2014 sparse vs dense."]],
    title: "Graphs (BFS / DFS / Union-Find)",
    summary: "Nodes + edges; traverse with BFS/DFS, group with union-find.",
    sections: [
      { h: "What it is", body: "A set of nodes (vertices) connected by edges, which may be directed/undirected and weighted/unweighted. Usually stored as an adjacency list (dict of node→neighbors)." },
      { h: "When to use it", body: "Connectivity, shortest paths, cycle detection, topological ordering of dependencies, islands/regions in a grid, and network/relationship problems." },
      { h: "How it works", body: "BFS uses a queue and explores level by level — it finds shortest paths in unweighted graphs. DFS uses recursion/stack and dives deep — good for cycles and topological sort. Union-Find (disjoint set) merges groups and answers “same component?” in near-O(1)." },
    ],
    complexity: [["BFS / DFS", "O(V + E)"], ["Dijkstra (heap)", "O(E log V)"], ["Union-Find op", "~O(1) amortized"], ["Space", "O(V + E)"]],
    examples: [
      { lang: "Python", code: `from collections import deque

# Number of islands — BFS over a grid
def num_islands(grid):
    if not grid: return 0
    R, C, count = len(grid), len(grid[0]), 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1':
                count += 1
                grid[r][c] = '0'
                q = deque([(r, c)])
                while q:
                    i, j = q.popleft()
                    for di, dj in ((1,0),(-1,0),(0,1),(0,-1)):
                        ni, nj = i+di, j+dj
                        if 0 <= ni < R and 0 <= nj < C and grid[ni][nj] == '1':
                            grid[ni][nj] = '0'
                            q.append((ni, nj))
    return count` },
      { lang: "JavaScript", code: `function numIslands(grid) {
  if (!grid.length) return 0;
  const R = grid.length, C = grid[0].length;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  let count = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (grid[r][c] === "1") {
      count++; grid[r][c] = "0";
      const q = [[r, c]];
      while (q.length) {
        const [i, j] = q.pop();
        for (const [di, dj] of dirs) {
          const ni = i + di, nj = j + dj;
          if (ni>=0 && ni<R && nj>=0 && nj<C && grid[ni][nj]==="1") {
            grid[ni][nj] = "0"; q.push([ni, nj]);
          }
        }
      }
    }
  }
  return count;
}` },
      { lang: "Java", code: `int numIslands(char[][] grid) {
    int R = grid.length, C = grid[0].length, count = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
        if (grid[r][c] == '1') {
            count++; grid[r][c] = '0';
            Deque<int[]> q = new ArrayDeque<>();
            q.add(new int[]{r, c});
            while (!q.isEmpty()) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int ni = cur[0] + d[0], nj = cur[1] + d[1];
                    if (ni>=0 && ni<R && nj>=0 && nj<C && grid[ni][nj]=='1') {
                        grid[ni][nj] = '0'; q.add(new int[]{ni, nj});
                    }
                }
            }
        }
    }
    return count;
}` },
      { lang: "C++", code: `int numIslands(vector<vector<char>>& grid) {
    int R = grid.size(), C = grid[0].size(), count = 0;
    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
        if (grid[r][c] == '1') {
            count++; grid[r][c] = '0';
            queue<pair<int,int>> q; q.push({r, c});
            while (!q.empty()) {
                auto [i, j] = q.front(); q.pop();
                for (auto& d : dirs) {
                    int ni = i + d[0], nj = j + d[1];
                    if (ni>=0 && ni<R && nj>=0 && nj<C && grid[ni][nj]=='1') {
                        grid[ni][nj] = '0'; q.push({ni, nj});
                    }
                }
            }
        }
    }
    return count;
}` },
    ],
    tips: [
      "BFS = shortest path in unweighted graphs; DFS = cycles & topo-sort.",
      "Mark nodes visited as you enqueue to avoid processing twice.",
      "Union-Find shines for dynamic connectivity / Kruskal's MST.",
    ],
  },
  {
    id: "backtracking",
    subtopics: [["Recursion fundamentals", "Base case + recursive case unwinding on the call stack."], ["Subsets / power set", "Include or exclude each element (2^n results)."], ["Permutations", "Arrange all elements in every order (n! results)."], ["Combinations / combination sum", "Choose k of n, or values summing to a target, avoiding duplicates."], ["Constraint puzzles", "N-Queens and Sudoku \u2014 place, validate, recurse, undo."], ["Grid / word search", "DFS through a grid marking and unmarking visited cells."], ["Pruning & bounding", "Cut branches that cannot lead to a valid/better answer early."], ["Recursion types", "Direct vs indirect (mutual), head vs tail, and tree recursion."], ["Memoization bridge", "Caching overlapping recursive calls turns backtracking into DP."]],
    types: [["Direct recursion", "A function calls itself."], ["Indirect / mutual recursion", "Functions call each other in a cycle."], ["Tail recursion", "The recursive call is the last action (optimizable)."], ["Backtracking", "Recursion that undoes choices to explore every option."]],
    title: "Recursion & Backtracking",
    summary: "Build candidates incrementally; undo and try the next path.",
    sections: [
      { h: "What it is", body: "Recursion solves a problem in terms of smaller subproblems. Backtracking is a structured recursion that explores all candidates: choose → recurse → un-choose." },
      { h: "When to use it", body: "Generating permutations/subsets/combinations, solving constraint puzzles (N-Queens, Sudoku), and word/path searches where you must explore and abandon dead ends." },
      { h: "How it works", body: "At each step you make a choice, recurse deeper, then undo the choice (remove it from the path) so the next branch starts clean. A base case records or returns a complete solution." },
    ],
    complexity: [["Subsets", "O(2^n)"], ["Permutations", "O(n!)"], ["Space (recursion)", "O(n)"]],
    examples: [
      { lang: "Python", code: `# All subsets via backtracking
def subsets(nums):
    res, path = [], []
    def dfs(start):
        res.append(path[:])          # record a copy
        for i in range(start, len(nums)):
            path.append(nums[i])     # choose
            dfs(i + 1)               # explore
            path.pop()               # un-choose
    dfs(0)
    return res

print(subsets([1, 2, 3]))  # [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]` },
      { lang: "JavaScript", code: `function subsets(nums) {
  const res = [], path = [];
  const dfs = (start) => {
    res.push([...path]);            // record a copy
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);           // choose
      dfs(i + 1);                   // explore
      path.pop();                   // un-choose
    }
  };
  dfs(0);
  return res;
}` },
      { lang: "Java", code: `List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    dfs(nums, 0, new ArrayList<>(), res);
    return res;
}
void dfs(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        dfs(nums, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}` },
      { lang: "C++", code: `void dfs(vector<int>& nums, int start, vector<int>& path, vector<vector<int>>& res) {
    res.push_back(path);
    for (int i = start; i < (int)nums.size(); i++) {
        path.push_back(nums[i]);
        dfs(nums, i + 1, path, res);
        path.pop_back();
    }
}
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res; vector<int> path;
    dfs(nums, 0, path, res);
    return res;
}` },
    ],
    tips: [
      "Always append a COPY (path[:]) — the path list keeps changing.",
      "Prune early: skip branches that can't lead to a valid answer.",
      "Sort first to skip duplicates in combination problems.",
    ],
  },
  {
    id: "dp",
    subtopics: [["Memoization (top-down)", "Recursion plus a cache; natural to write, lazy evaluation."], ["Tabulation (bottom-up)", "Iteratively fill a table from base cases; easy to space-optimize."], ["1-D DP", "Single-index state \u2014 Fibonacci, climbing stairs, house robber."], ["Knapsack family", "0/1 knapsack, unbounded knapsack, subset sum, equal partition."], ["Grid DP", "2-D state \u2014 unique paths, minimum path sum, dungeon game."], ["String DP", "Longest common subsequence, edit distance, palindromic substrings, regex matching."], ["Interval DP", "Solve over ranges \u2014 matrix-chain multiplication, burst balloons."], ["DP on trees", "Combine children's results at each node (e.g., house robber III)."], ["Bitmask DP", "Encode a small set in bits \u2014 travelling salesman, assignment."], ["Rolling array", "Keep only the previous row/state to cut space from O(n\u00b7m) to O(m)."]],
    types: [["Top-down (memoization)", "Recursion plus a cache of solved subproblems."], ["Bottom-up (tabulation)", "Fill a table from base cases upward."], ["1-D DP", "State is a single index (Fibonacci, house robber)."], ["2-D DP", "State is two indices (edit distance, LCS, grids)."], ["Knapsack-style", "Choose or skip items under a capacity limit."]],
    title: "Dynamic Programming",
    summary: "Cache overlapping subproblems; build the answer from smaller ones.",
    sections: [
      { h: "What it is", body: "DP solves problems with optimal substructure (the answer is built from sub-answers) and overlapping subproblems (the same sub-answers recur). You compute each subproblem once and reuse it." },
      { h: "When to use it", body: "“Count the ways”, “min/max cost”, “longest/shortest” over choices — Fibonacci, coin change, knapsack, edit distance, longest common subsequence, grid paths." },
      { h: "How it works", body: "Two styles: top-down (recursion + memoization cache) or bottom-up (fill a table from base cases upward). The hard part is defining the state (what the indices of your table mean) and the transition (how a state depends on smaller ones)." },
    ],
    complexity: [["Typical time", "O(states × transition)"], ["1-D DP", "O(n)"], ["2-D DP", "O(n·m)"], ["Space", "O(states), often reducible"]],
    examples: [
      { lang: "Python", code: `# Coin change — fewest coins to make 'amount' (bottom-up)
def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount       # dp[x] = min coins for x
    for x in range(1, amount + 1):
        for c in coins:
            if c <= x:
                dp[x] = min(dp[x], dp[x - c] + 1)
    return dp[amount] if dp[amount] != INF else -1

print(coin_change([1, 2, 5], 11))  # 3  (5 + 5 + 1)` },
      { lang: "JavaScript", code: `function coinChange(coins, amount) {
  const INF = amount + 1;
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;
  for (let x = 1; x <= amount; x++)
    for (const c of coins)
      if (c <= x) dp[x] = Math.min(dp[x], dp[x - c] + 1);
  return dp[amount] === INF ? -1 : dp[amount];
}
console.log(coinChange([1, 2, 5], 11)); // 3` },
      { lang: "Java", code: `int coinChange(int[] coins, int amount) {
    int INF = amount + 1;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, INF);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        for (int c : coins)
            if (c <= x) dp[x] = Math.min(dp[x], dp[x - c] + 1);
    return dp[amount] == INF ? -1 : dp[amount];
}` },
      { lang: "C++", code: `int coinChange(vector<int>& coins, int amount) {
    int INF = amount + 1;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;
    for (int x = 1; x <= amount; x++)
        for (int c : coins)
            if (c <= x) dp[x] = min(dp[x], dp[x - c] + 1);
    return dp[amount] == INF ? -1 : dp[amount];
}` },
    ],
    tips: [
      "Define the state first — “dp[i] means …” in one clear sentence.",
      "Start top-down with @lru_cache, then convert to a table if needed.",
      "Many 2-D DPs compress to 1-D by keeping only the previous row.",
    ],
  },
  {
    id: "greedy",
    subtopics: [["Interval scheduling", "Sort by end time and keep the earliest-finishing non-overlapping choices."], ["Fractional knapsack", "Take items by highest value/weight ratio first."], ["Huffman coding", "Repeatedly merge the two least-frequent nodes to build an optimal prefix code."], ["Jump game / reachability", "Track the farthest reachable index in one sweep."], ["MST as greedy", "Kruskal and Prim greedily add the safest cheapest edge."], ["Dijkstra as greedy", "Always finalize the closest unvisited node next."], ["Greedy-choice proof", "Justify with an exchange argument \u2014 swapping into the greedy choice never hurts."]],
    types: [["Selection greedy", "Repeatedly pick the best remaining item (interval scheduling)."], ["Exchange-argument greedy", "Justified by proving a swap never hurts (Huffman, ratio sort)."]],
    title: "Greedy Algorithms",
    summary: "Take the locally best choice and never look back — when it's safe.",
    sections: [
      { h: "What it is", body: "A greedy algorithm builds a solution step by step, always choosing the option that looks best right now, without reconsidering past choices." },
      { h: "When to use it", body: "Interval scheduling, Huffman coding, jump-game reachability, and many minimum/maximum problems — but ONLY when a greedy choice provably leads to a global optimum." },
      { h: "How it works", body: "Usually sort by a key (end time, ratio, value) then sweep once, committing to each choice. The proof obligation is the “greedy-choice property”: a locally optimal choice is part of some global optimum." },
    ],
    complexity: [["Sort + sweep", "O(n log n)"], ["Sweep only", "O(n)"], ["Space", "O(1)–O(n)"]],
    examples: [
      { lang: "Python", code: `# Max non-overlapping intervals: always keep the earliest-ending one
def max_meetings(intervals):
    intervals.sort(key=lambda x: x[1])   # sort by end time
    count, end = 0, float('-inf')
    for s, e in intervals:
        if s >= end:        # doesn't overlap the last kept
            count += 1
            end = e
    return count

print(max_meetings([(1,3),(2,4),(3,5),(0,6)]))  # 2` },
      { lang: "JavaScript", code: `function maxMeetings(intervals) {
  intervals.sort((a, b) => a[1] - b[1]); // by end time
  let count = 0, end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) { count++; end = e; }
  }
  return count;
}
console.log(maxMeetings([[1,3],[2,4],[3,5],[0,6]])); // 2` },
      { lang: "Java", code: `int maxMeetings(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]); // by end time
    int count = 0, end = Integer.MIN_VALUE;
    for (int[] iv : intervals)
        if (iv[0] >= end) { count++; end = iv[1]; }
    return count;
}` },
      { lang: "C++", code: `int maxMeetings(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end(), [](auto& a, auto& b){ return a[1] < b[1]; });
    int count = 0, end = INT_MIN;
    for (auto& x : iv) if (x[0] >= end) { count++; end = x[1]; }
    return count;
}` },
    ],
    tips: [
      "Greedy is fast but WRONG unless you can justify it — test small cases.",
      "If greedy fails, the problem usually needs DP.",
      "The right sort key is the whole trick (end time, value/weight, …).",
    ],
  },
  {
    id: "bits",
    subtopics: [["Operators", "AND, OR, XOR, NOT, and left/right shifts on the binary form."], ["Get / set / clear / toggle", "x>>i&1, x|(1<<i), x&~(1<<i), x^(1<<i)."], ["Count set bits", "Brian Kernighan's x &= x-1 loop counts 1-bits."], ["XOR tricks", "Single number, swap without a temp, find the missing/duplicate number."], ["Bitmask as a set", "Represent subsets of \u2264~20 elements; enumerate all submasks."], ["Power-of-two test", "x>0 && (x & (x-1))==0."], ["Lowest set bit", "x & -x isolates the lowest 1-bit (used in Fenwick trees)."], ["Gray code & bit DP", "Sequences differing by one bit; bitmask states in DP."]],
    types: [["Masking", "Use a bitmask to represent a small set."], ["Flags / toggling", "Set, clear, and check individual bits."], ["XOR tricks", "Cancel pairs, swap without a temp, find the odd one out."]],
    title: "Bit Manipulation",
    summary: "Operate on individual bits for speed and clever tricks.",
    sections: [
      { h: "What it is", body: "Using bitwise operators — AND (&), OR (|), XOR (^), NOT (~), shifts (<<, >>) — to manipulate the binary representation of integers directly." },
      { h: "When to use it", body: "Sets as bitmasks, toggling/checking flags, finding the single non-duplicated number (XOR), counting set bits, and subset enumeration in DP." },
      { h: "How it works", body: "Each bit is a boolean. x & (1<<i) checks bit i; x | (1<<i) sets it; x ^ (1<<i) toggles it; x & (x-1) clears the lowest set bit. XOR is its own inverse: a ^ a = 0, which cancels pairs." },
    ],
    complexity: [["Bitwise op", "O(1)"], ["Count bits", "O(#set bits)"], ["Subset enum", "O(2^n)"]],
    examples: [
      { lang: "Python", code: `# Single Number: every value appears twice except one -> XOR them all
def single_number(nums):
    res = 0
    for x in nums:
        res ^= x        # pairs cancel to 0
    return res

print(single_number([4, 1, 2, 1, 2]))  # 4
print(bin(0b1010 & (0b1010 - 1)))       # clears lowest set bit -> 0b1000` },
      { lang: "JavaScript", code: `function singleNumber(nums) {
  let res = 0;
  for (const x of nums) res ^= x; // pairs cancel to 0
  return res;
}
console.log(singleNumber([4, 1, 2, 1, 2])); // 4` },
      { lang: "Java", code: `int singleNumber(int[] nums) {
    int res = 0;
    for (int x : nums) res ^= x; // pairs cancel
    return res;
}` },
      { lang: "C++", code: `int singleNumber(vector<int>& nums) {
    int res = 0;
    for (int x : nums) res ^= x; // pairs cancel
    return res;
}` },
    ],
    tips: [
      "a ^ a = 0 and a ^ 0 = a — XOR cancels duplicates.",
      "x & (x-1) removes the lowest set bit; loop to count bits.",
      "1 << k is 2^k; use bitmasks to represent small sets.",
    ],
  },
  {
    id: "sorting",
    subtopics: [["Elementary sorts", "Bubble, selection, insertion \u2014 O(n\u00b2), useful only for tiny/nearly-sorted inputs."], ["Merge sort", "Divide and conquer; stable; O(n log n) with O(n) extra space."], ["Quick sort", "Partition around a pivot in place; O(n log n) average, O(n\u00b2) worst."], ["Heap sort", "Build a heap then extract; in-place O(n log n), not stable."], ["Counting sort", "Count occurrences of bounded integers \u2014 O(n+k), stable."], ["Radix sort", "Sort digit by digit using a stable sub-sort \u2014 O(d\u00b7(n+k))."], ["Bucket sort", "Distribute into buckets then sort each \u2014 great for uniform data."], ["Stability & in-place", "Stability preserves equal-key order; in-place uses O(1) extra space."], ["Timsort", "Hybrid merge+insertion sort used by Python and Java for objects."], ["Quickselect", "Partition-based selection of the k-th element in O(n) average."]],
    types: [["Bubble / Insertion / Selection", "Simple O(n\u00b2) sorts \u2014 teaching and tiny inputs."], ["Merge sort", "Stable, O(n log n), needs O(n) extra space."], ["Quick sort", "In-place, O(n log n) average, O(n\u00b2) worst."], ["Heap sort", "In-place O(n log n) using a heap."], ["Counting / Radix / Bucket", "Non-comparison, O(n) for bounded integers."]],
    title: "Sorting",
    summary: "Ordering data — the setup step for countless techniques.",
    sections: [
      { h: "What it is", body: "Arranging elements by a key. Comparison sorts (merge, quick, heap) are O(n log n); non-comparison sorts (counting, radix) can hit O(n) for bounded integers." },
      { h: "When to use it", body: "As a preprocessing step for two pointers, binary search, greedy, and de-duplication. Knowing the trade-offs (stability, in-place, worst case) helps you pick or explain a sort." },
      { h: "How it works", body: "Merge sort splits, sorts halves, and merges (stable, O(n) extra space). Quick sort partitions around a pivot in place (O(n log n) average, O(n²) worst). Most languages use a hybrid like Timsort (merge + insertion), which is stable." },
    ],
    complexity: [["Merge sort", "O(n log n)"], ["Quick sort (avg)", "O(n log n)"], ["Quick sort (worst)", "O(n²)"], ["Counting/Radix", "O(n + k)"]],
    examples: [
      { lang: "Python", code: `# Merge sort — stable, O(n log n)
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left, right = merge_sort(a[:mid]), merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    out.extend(left[i:]); out.extend(right[j:])
    return out

print(merge_sort([5, 2, 9, 1, 5, 6]))  # [1, 2, 5, 5, 6, 9]` },
      { lang: "JavaScript", code: `function mergeSort(a) {
  if (a.length <= 1) return a;
  const mid = a.length >> 1;
  const left = mergeSort(a.slice(0, mid));
  const right = mergeSort(a.slice(mid));
  const out = []; let i = 0, j = 0;
  while (i < left.length && j < right.length)
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return out.concat(left.slice(i)).concat(right.slice(j));
}
console.log(mergeSort([5, 2, 9, 1, 5, 6])); // [1,2,5,5,6,9]` },
      { lang: "Java", code: `int[] mergeSort(int[] a) {
    if (a.length <= 1) return a;
    int mid = a.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(a, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(a, mid, a.length));
    int[] out = new int[a.length];
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length)
        out[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.length) out[k++] = left[i++];
    while (j < right.length) out[k++] = right[j++];
    return out;
}` },
      { lang: "C++", code: `vector<int> mergeSort(vector<int> a) {
    if (a.size() <= 1) return a;
    int mid = a.size() / 2;
    vector<int> left(a.begin(), a.begin() + mid);
    vector<int> right(a.begin() + mid, a.end());
    left = mergeSort(left); right = mergeSort(right);
    vector<int> out; int i = 0, j = 0;
    while (i < (int)left.size() && j < (int)right.size())
        out.push_back(left[i] <= right[j] ? left[i++] : right[j++]);
    while (i < (int)left.size()) out.push_back(left[i++]);
    while (j < (int)right.size()) out.push_back(right[j++]);
    return out;
}` },
    ],
    tips: [
      "Stable sorts keep equal elements in original order — matters for multi-key sorts.",
      "Sort by a custom key (lambda) instead of writing comparators.",
      "Counting/radix sort beats O(n log n) only for small integer ranges.",
    ],
  },
];
export const dsaCourse = [
  {
    id: "fundamentals", num: 1, title: "Programming Fundamentals",
    summary: "The building blocks every program is made of — master these before any data structure.",
    classes: [
      { title: "Basics", topics: [
        ["Variables", "A variable is a named location in memory that holds a value you can read or change later. When you write age = 25, the computer reserves a slot, labels it 'age', and stores 25 there; using 'age' anywhere afterwards fetches that value. Variables let a program remember and reuse results instead of recomputing them, and their value can change as the program runs."],
        ["Data Types", "A data type tells the computer what kind of value a variable holds and how to treat it: whole numbers (int), decimals (float), true/false (boolean), single letters (char), and text (string). The type decides how much memory is used and which operations are legal — you can add two ints, but 'cat' + 5 is meaningless. Languages are either statically typed (you declare the type, like Java/C++) or dynamically typed (inferred at runtime, like Python/JS)."],
        ["Operators", "Operators are symbols that combine or compare values. Arithmetic operators (+ - * / and % for remainder) do math; comparison operators (==, !=, <, >, <=, >=) return true/false; logical operators (and, or, not) combine conditions; assignment operators (=, +=, -=) store results. Understanding operator precedence (e.g. * before +) is essential to avoid subtle bugs."],
        ["Input / Output", "Input is how a program receives data — from the keyboard, a file, or a network — and output is how it shows results, usually by printing to the console. In Python you use input() and print(), in C++ cin and cout, in Java Scanner and System.out.println. In coding interviews and competitive programming, reading input fast and printing in the exact required format matters a lot."],
        ["Type Casting", "Type casting converts a value from one type to another. Implicit casting happens automatically and safely (an int becomes a float when you write 3 + 2.0), while explicit casting is something you write yourself, like int('42') to turn the text '42' into the number 42. Casting carelessly can lose data — turning the float 3.9 into an int gives 3, not 4 — so you must know whether a conversion truncates, rounds, or can fail."],
      ]},
      { title: "Control Flow", topics: [
        ["if / else", "An if statement runs a block of code only when its condition is true, and the optional else block runs when it is false. You can chain conditions with else-if to test several cases in order, stopping at the first that matches. This is how a program makes decisions — for example, 'if balance >= price then buy, else show an error'."],
        ["switch", "A switch statement compares one value against many fixed cases and jumps to the matching block, which is cleaner than a long chain of if-else when you are checking the same variable repeatedly. Each case usually ends with a break so execution does not 'fall through' into the next case, and a default case handles anything unmatched. It is common for menus, state machines, and command handling."],
        ["Loops (for, while, do-while)", "Loops repeat a block of code so you do not have to copy it. Use a for loop when you know how many times to repeat (iterate an array of n items), a while loop when you repeat until some condition becomes false (keep reading until end of file), and a do-while when the body must run at least once before the condition is checked. Every loop needs something that eventually makes it stop, or it runs forever."],
        ["break / continue", "Inside a loop, break stops the loop entirely and jumps to the code after it, while continue skips the rest of the current iteration and moves on to the next one. For example, break out of a search loop the moment you find your target, or continue past invalid items without processing them. They keep loops readable by avoiding deeply nested conditions."],
      ]},
      { title: "Functions", topics: [
        ["Function Declaration", "A function is a named, reusable block of code that performs one task; you write it once and call it wherever needed. This avoids repetition, makes code easier to test and debug, and lets you give a meaningful name to a piece of logic (like calculateTax). Well-named functions act as documentation for what your program does."],
        ["Parameters", "Parameters are the inputs a function declares so it can work on different data each time it is called; the actual values you pass in are called arguments. For example add(a, b) declares two parameters, and add(3, 5) passes the arguments 3 and 5. Parameters can have default values and can be passed by value (a copy) or by reference (the original), which affects whether the function can modify the caller's data."],
        ["Return Types", "The return value is the result a function hands back to whoever called it, captured with the return keyword. A function that returns an int gives you a number you can store or use in further math; a function that returns nothing is called void (C++/Java) or returns None (Python). return also immediately ends the function, so code after it does not run."],
        ["Recursion Basics", "Recursion is when a function solves a problem by calling itself on a smaller version of the same problem. It needs two parts: a base case that returns directly without recursing (the stopping point) and a recursive case that reduces the problem and calls itself. It is natural for problems with self-similar structure, like trees, factorials, and divide-and-conquer algorithms."],
      ]},
    ],
  },
  {
    id: "complexity", num: 2, title: "Time & Space Complexity",
    summary: "How to measure whether an algorithm is fast and memory-light enough to scale.",
    classes: [
      { title: "Complexity Analysis", topics: [
        ["Big O Notation", "Big O describes how an algorithm's running time grows as the input size n grows, focusing on the worst case and ignoring constant factors and lower-order terms. O(1) means constant time (independent of n), O(log n) halves the work each step (binary search), O(n) scales linearly, O(n log n) is typical of good sorts, and O(n²) doubles-and-squares with nested loops. It lets you compare algorithms by their growth rate rather than machine speed, so an O(n) solution always beats an O(n²) one for large enough inputs."],
        ["Omega (Ω)", "Omega describes the best-case lower bound — the fewest steps an algorithm can possibly take on the most favourable input. For example, linear search is Omega(1) because the target might be the very first element it checks. It is less used in interviews than Big O, but it completes the picture by telling you how fast things can go in the luckiest case."],
        ["Theta (Θ)", "Theta is a tight bound used when an algorithm's best case and worst case grow at the same rate, so it is squeezed between matching upper and lower bounds. For instance, summing an array is Theta(n) because you always touch every element regardless of their values. When people loosely say an algorithm 'is O(n)' but mean it is always n, Theta is the technically precise term."],
      ]},
      { title: "Complexity Calculation", topics: [
        ["Loop Analysis", "A single loop that runs n times is O(n), and the cost of the work inside each iteration multiplies in — a loop doing O(1) work stays O(n), but a loop doing O(n) work each time becomes O(n²). To analyse, count how many times the loop body executes as a function of n. Loops that grow or shrink by a multiplicative factor (i *= 2) run O(log n) times, not O(n)."],
        ["Nested Loops", "When one loop sits inside another, their iteration counts multiply: an outer loop of n and an inner loop of n give n × n = O(n²). If the inner loop depends on the outer index (j starts at i), the total is the triangular sum n(n+1)/2, which is still O(n²). Recognising nested loops is the quickest way to spot a quadratic algorithm that may need optimising with hashing or two pointers."],
        ["Recursive Complexity", "To analyse recursion, write a recurrence that expresses the total work as the work per call plus the cost of the recursive calls — merge sort is T(n) = 2T(n/2) + O(n). You then solve it, often with the Master Theorem, which gives O(n log n) here. A handy shortcut: the total work equals the number of nodes in the recursion tree times the work done at each node."],
      ]},
      { title: "Space Complexity", topics: [
        ["Auxiliary Space", "Auxiliary space is the extra memory an algorithm needs beyond the input itself — temporary arrays, hash maps, and the recursion call stack all count. For example, merge sort uses O(n) auxiliary space for its merge buffer, while in-place quicksort uses only O(log n) for its stack. Interviewers often ask you to reduce auxiliary space, such as solving a problem in O(1) extra space."],
        ["Memory Usage", "Total space complexity counts everything the program holds in memory, including the input and all auxiliary structures. Many algorithms trade space for time — a hash map turns an O(n²) search into O(n) by spending O(n) memory, and dynamic programming stores subproblem answers to avoid recomputation. Good engineers weigh this trade-off against the limits of the machine."],
      ]},
    ],
  },
  {
    id: "arrays", num: 3, title: "Arrays", codeId: "arrays",
    summary: "Contiguous, index-addressable storage — the most-used structure in interviews.",
    classes: [
      { title: "Basics", topics: [
        ["Array Declaration", "An array reserves a single contiguous block of memory for n elements of the same type, which is why any element is reachable in O(1) by computing its address (base + index × element size). You declare it with a fixed capacity in low-level languages (int arr[10]) or use a growable list in high-level ones. Because the memory is contiguous, arrays are also cache-friendly, making sequential scans very fast in practice."],
        ["Traversal", "Traversal means visiting each element in order, usually with a simple for loop from index 0 to n-1, and it costs O(n). It is the foundation of almost every array algorithm — summing, searching, transforming. Mastering clean traversal (and traversing two arrays together, or backwards) prevents most off-by-one bugs."],
        ["Insertion", "Adding an element at the end of a dynamic array is O(1) on average, but inserting in the middle is O(n) because every element after the insertion point must shift one position to the right to make room. This shifting cost is the main weakness of arrays compared to linked lists. If you must insert often in the middle, an array may be the wrong structure."],
        ["Deletion", "Removing an element from the middle is O(n) because the gap must be closed by shifting all later elements one step to the left. Deleting from the end is O(1). A common trick when order does not matter is to swap the element with the last one and pop the end, turning deletion into O(1)."],
      ]},
      { title: "Intermediate", topics: [
        ["Searching", "Searching an unsorted array requires a linear scan checking each element, which is O(n). If the array is sorted, binary search repeatedly halves the range to find the target in O(log n). Choosing the right search depends entirely on whether the data is sorted and whether you will search many times (then sorting first pays off)."],
        ["Updating", "Changing the value stored at a known index is O(1) because you jump straight to that memory slot — this direct random access is the array's superpower. It is why arrays are ideal for lookup tables, counting arrays, and dynamic-programming tables where you repeatedly read and write by index."],
        ["Rotations", "Rotating an array by k shifts every element k places left or right, wrapping around the ends. The naive approach moves one element at a time in O(n·k); the elegant trick reverses the whole array, then reverses the two parts, achieving rotation in O(n) time and O(1) extra space. Rotations appear in scheduling, circular buffers, and many interview problems."],
      ]},
      { title: "Advanced", topics: [
        ["Prefix Sum", "A prefix-sum array stores the cumulative total up to each index, so prefix[i] = arr[0] + … + arr[i]. After this O(n) preprocessing, the sum of any range [l, r] is answered in O(1) as prefix[r] - prefix[l-1], turning repeated range-sum queries from O(n) each into O(1) each. The same idea extends to 2-D prefix sums for fast submatrix sums."],
        ["Kadane's Algorithm", "Kadane's algorithm finds the contiguous subarray with the largest sum in a single O(n) pass. It keeps a running sum and, at each element, either extends the current subarray or restarts from the current element if the running sum has gone negative, tracking the best seen so far. It is the classic example of turning an O(n²) brute force into a clean linear dynamic-programming solution."],
        ["Sliding Window", "The sliding-window technique maintains a moving sub-range over the array and slides it instead of recomputing from scratch, giving O(n) overall. A fixed window keeps a constant size (max sum of any k elements) while a variable window grows and shrinks to satisfy a constraint (longest subarray with sum ≤ K). The key is updating the window's running state incrementally as elements enter and leave."],
        ["Two Pointers", "Two pointers uses two indices that move through the data based on a condition, replacing a nested loop with a single O(n) pass. They may start at opposite ends and move inward (finding a pair that sums to a target in a sorted array) or move in the same direction at different speeds. This pattern is the go-to optimisation for sorted arrays, partitioning, and in-place editing."],
      ]},
    ],
  },
  {
    id: "strings", num: 4, title: "Strings",
    summary: "Sequences of characters — array techniques plus powerful pattern-matching algorithms.",
    classes: [
      { title: "Basics", topics: [
        ["String Operations", "Strings support length, concatenation, substring extraction, indexing, and comparison, and you should know the cost of each. A crucial detail is immutability: in Python, Java, and JavaScript a string cannot be changed in place, so every concatenation creates a new string — building a long string in a loop with + is O(n²), which is why you use a list/StringBuilder and join at the end. Comparison is lexicographic (dictionary order), character by character."],
        ["Character Arrays", "Under the hood a string is an array of characters, and converting a string to a mutable char array lets you edit it in place in O(1) per change instead of rebuilding it. This is essential for in-place algorithms like reversing or partitioning a string. Remember that characters are really small integers (their ASCII/Unicode codes), so 'a' - 'a' = 0 lets you map letters to array indices for counting."],
      ]},
      { title: "Intermediate", topics: [
        ["String Reversal", "Reversing a string swaps characters from both ends moving toward the middle, using two pointers in O(n) time and O(1) extra space if you have a mutable char array. It is a building block for palindrome checks and many parsing tasks. In languages with immutable strings you build the reversed result into a new buffer."],
        ["Palindrome", "A palindrome reads the same forwards and backwards, like 'level' or 'racecar'. You verify one by placing a pointer at each end and walking inward, comparing characters until they meet — O(n). Variations include ignoring case and non-letters, or finding the longest palindromic substring (expand-around-centre or dynamic programming)."],
        ["Anagrams", "Two strings are anagrams if they contain exactly the same characters in the same counts, just rearranged, like 'listen' and 'silent'. You detect this either by sorting both and comparing (O(n log n)) or, faster, by building a frequency count of each character and comparing the counts (O(n)). Counting with a fixed 26-length array is the most efficient approach for lowercase letters."],
      ]},
      { title: "Advanced", topics: [
        ["Pattern Matching", "Pattern matching searches for every occurrence of a pattern of length m inside a text of length n. The naive method tries the pattern at each starting position and compares character by character, which is O(n·m) in the worst case (think 'aaaa…' searching for 'aaab'). The advanced algorithms below avoid re-checking characters they have already matched, bringing this down to linear time."],
        ["KMP Algorithm", "Knuth-Morris-Pratt preprocesses the pattern into a 'failure function' (longest prefix that is also a suffix) so that on a mismatch it shifts the pattern intelligently instead of restarting from scratch. This means the text pointer never moves backward, giving O(n + m) matching. The clever insight is reusing the partial match you already had to skip positions that cannot match."],
        ["Rabin-Karp", "Rabin-Karp hashes the pattern once and then computes a rolling hash for each window of the text, comparing hashes instead of characters; matching hashes are then verified to rule out collisions. Because the rolling hash updates in O(1) as the window slides, average matching is O(n + m). It shines when searching for many patterns at once, as in plagiarism detection."],
        ["Z Algorithm", "The Z-algorithm builds a Z-array where Z[i] is the length of the longest substring starting at i that matches the prefix of the string. By concatenating pattern + separator + text and computing the Z-array in linear time, every position where Z equals the pattern length marks a match. It gives clean O(n + m) pattern search and is a favourite in competitive programming."],
      ]},
    ],
  },
  {
    id: "recursion", num: 5, title: "Recursion & Backtracking", codeId: "backtracking",
    summary: "Solve a problem with smaller copies of itself, then explore and undo choices.",
    classes: [
      { title: "Recursion Basics", topics: [
        ["Recursive Functions", "A recursive function calls itself on a strictly smaller input, breaking a hard problem into easier sub-problems of the same shape. Each call should make 'progress' toward the base case, otherwise it loops forever. Thinking recursively means trusting that the function correctly solves the smaller case, then combining that result — a mindset that makes trees, graphs, and divide-and-conquer far easier."],
        ["Base Case", "The base case is the condition under which the function returns an answer directly without recursing — it is the floor that stops the recursion. For factorial, 0! = 1 is the base case; for tree recursion, an empty node returns immediately. Forgetting or mis-writing the base case is the number-one cause of infinite recursion and stack-overflow crashes."],
        ["Call Stack", "Every function call is pushed onto the call stack with its own copy of parameters and local variables, and it is popped off when it returns, resuming the caller exactly where it left off. Recursion depth therefore equals memory used on the stack — deep recursion (e.g. n = 1,000,000) can overflow the stack. Visualising the stack growing and unwinding is the key to debugging recursion."],
      ]},
      { title: "Problems", topics: [
        ["Factorial", "Factorial is the classic introduction to recursion: n! = n × (n-1)! with the base case 0! = 1. It shows the two essential ingredients clearly — a base case and a self-call on a smaller input — and unwinds as 3 × 2 × 1 × 1. It is O(n) time and O(n) stack depth."],
        ["Fibonacci", "The Fibonacci sequence defines each number as the sum of the previous two: F(n) = F(n-1) + F(n-2), with F(0)=0, F(1)=1. Naive recursion recomputes the same values exponentially many times (O(2^n)), which is the perfect motivation for memoization — caching each F(n) drops it to O(n). It bridges recursion and dynamic programming."],
        ["Power Function", "Computing x^n naively multiplies n times (O(n)), but fast exponentiation halves the exponent each step using x^n = (x^(n/2))² (and one extra x if n is odd), giving O(log n). This 'exponentiation by squaring' is widely used in modular arithmetic and cryptography. It is a great example of recursion turning linear work into logarithmic."],
      ]},
      { title: "Backtracking", topics: [
        ["N-Queens", "The N-Queens puzzle places N queens on an N×N board so none attack each other. Backtracking places one queen per row, and for each row tries each safe column, recursing to the next row and undoing the placement if it leads to a dead end. It demonstrates the choose-explore-unchoose pattern and pruning of invalid branches via column/diagonal checks."],
        ["Sudoku Solver", "A Sudoku solver fills empty cells by trying digits 1-9 that do not violate the row, column, and 3×3-box constraints, recursing after each placement and backtracking when no digit fits. It is constraint satisfaction by depth-first search with pruning. The art is in checking validity efficiently so dead branches are abandoned early."],
        ["Rat in a Maze", "In the Rat-in-a-Maze problem you find a path from the top-left to the bottom-right of a grid, moving through open cells. Backtracking explores a direction, marks the cell as part of the current path, recurses, and unmarks it if the path fails — ensuring cells are not reused within one path. It is the grid-traversal template behind word-search and flood-fill problems."],
        ["Permutations", "Generating all permutations produces every possible ordering of the elements (n! of them). Backtracking fixes one element at a position, recurses on the rest, then undoes the choice to try the next, often by swapping in place. Understanding this pattern unlocks subsets, combinations, and most 'generate all arrangements' interview questions."],
      ]},
    ],
  },
  {
    id: "linkedlist", num: 6, title: "Linked List", codeId: "linkedlist",
    summary: "Nodes joined by pointers — O(1) insert/delete but no random access.",
    classes: [
      { title: "Singly Linked List", topics: [
        ["Node Structure", "A singly linked list is a chain of nodes, where each node stores a value and a 'next' pointer to the following node; the list is referenced by a head pointer, and the last node points to null. Unlike an array, the nodes are scattered in memory and linked only by pointers, so there is no index arithmetic. This is why you trade random access for cheap insertion and deletion."],
        ["Insertion", "Inserting a node means creating it and rewiring pointers: to add at the head you point the new node to the old head and update head; to insert after a node you splice it between that node and its successor. Each of these is O(1) once you are at the right place. The subtlety is always updating pointers in the correct order so you do not lose the rest of the list."],
        ["Deletion", "Deleting a node means making its predecessor's next pointer skip over it to point at its successor, after which the removed node can be freed. This is O(1) if you already hold the predecessor. A dummy head node makes deleting the first element as uniform as deleting any other, removing special-case code."],
        ["Traversal", "Traversal walks from the head following next pointers until reaching null, visiting every node in O(n). Because you cannot jump to the middle, even reaching the k-th node requires walking k steps. Many list algorithms are built on careful traversal with one or two moving pointers."],
      ]},
      { title: "Doubly Linked List", topics: [
        ["Insert / Delete", "A doubly linked list gives each node both a next and a prev pointer, so given a node you can delete it in O(1) without first finding its predecessor — you just relink its neighbours to each other. Insertion similarly updates four pointers. This bidirectional linking costs extra memory per node but enables structures like the LRU cache."],
        ["Forward & Backward Traversal", "Because each node knows its previous neighbour, you can traverse a doubly linked list in either direction, which is impossible in a singly linked list without extra work. This is useful for browser history (back/forward), undo-redo stacks, and music playlists. The trade-off is the extra prev pointer to maintain on every operation."],
      ]},
      { title: "Circular Linked List", topics: [
        ["Operations", "In a circular linked list the last node's next points back to the head instead of null, forming a ring. This is ideal for round-robin scheduling and repeating playlists, where you cycle endlessly through elements. The main caution is loop termination: since there is no null end, you must stop after returning to the starting node."],
      ]},
      { title: "Advanced", topics: [
        ["Reverse List", "Reversing a linked list flips every next pointer so the tail becomes the head. The iterative method walks the list keeping three pointers (previous, current, next), pointing current backward at each step — O(n) time, O(1) space. It is one of the most common interview questions and the foundation for reversing in groups of k."],
        ["Detect Cycle", "A cycle exists if some node's next eventually points back to an earlier node, making traversal loop forever. Floyd's tortoise-and-hare algorithm uses a slow pointer (one step) and a fast pointer (two steps); if they ever meet, there is a cycle, and a second phase finds the cycle's start — all in O(n) time and O(1) space. It is far more elegant than storing visited nodes in a set."],
        ["Merge Lists", "Merging two sorted linked lists weaves them into one sorted list by repeatedly attaching the smaller current node, using a dummy head to simplify the code — O(n + m). Merging k sorted lists efficiently uses a min-heap of the k current heads, giving O(N log k). These patterns power external sorting and the merge step of merge sort."],
      ]},
    ],
  },
  {
    id: "stack", num: 7, title: "Stack", codeId: "stackqueue",
    summary: "Last-In-First-Out container — the natural model for nesting and undo.",
    classes: [
      { title: "Basics", topics: [
        ["Push", "Push adds an element to the top of the stack in O(1). Because a stack only ever grows and shrinks at one end, it is trivially implemented with a dynamic array (append) or a linked list (add at head). The 'top' is the most recently added element."],
        ["Pop", "Pop removes and returns the top element in O(1), revealing the element pushed just before it — this Last-In-First-Out order is the defining property. Popping an empty stack is an error you must guard against (underflow). Push and pop together model any nested or reversible process."],
        ["Peek", "Peek (or top) looks at the top element without removing it, also O(1). It lets you inspect the current state — for example, checking the most recent unmatched bracket — before deciding whether to pop. Like pop, peeking an empty stack must be handled carefully."],
      ]},
      { title: "Applications", topics: [
        ["Balanced Parentheses", "To check that brackets are balanced, scan the string pushing every opening bracket and, on each closing bracket, popping and verifying it matches the expected opener. The string is balanced only if every closer matched and the stack is empty at the end. This is the canonical stack problem and the basis of parsers and compilers."],
        ["Infix to Postfix", "The shunting-yard algorithm converts human-friendly infix expressions (a + b * c) into postfix (a b c * +) that machines evaluate easily, using a stack to hold operators and pop them according to precedence and associativity. It removes the need for parentheses in the output. Understanding it explains how calculators and language interpreters parse arithmetic."],
        ["Expression Evaluation", "Evaluating a postfix expression uses a stack: push operands, and when you hit an operator pop the top two operands, apply it, and push the result. After processing all tokens the single value left on the stack is the answer. This is O(n) and pairs naturally with infix-to-postfix conversion."],
      ]},
      { title: "Advanced", topics: [
        ["Monotonic Stack", "A monotonic stack keeps its elements in strictly increasing or decreasing order by popping any element that would break the order before pushing a new one. This lets you answer 'next greater/smaller element' type questions in a single O(n) pass instead of O(n²). It powers problems like daily temperatures, stock spans, and largest rectangle in a histogram."],
        ["Next Greater Element", "For each element, the next greater element is the first larger value to its right. Using a decreasing monotonic stack, you push indices and, whenever the current value exceeds the value at the stack's top, you have found that element's answer and pop it. The whole array is processed in O(n) because each index is pushed and popped at most once."],
      ]},
    ],
  },
  {
    id: "queue", num: 8, title: "Queue", codeId: "stackqueue",
    summary: "First-In-First-Out container for fair, in-order processing.",
    classes: [
      { title: "Basics", topics: [
        ["Enqueue", "Enqueue adds an element to the back of the queue in O(1), like joining the end of a line. Combined with dequeue at the front, this First-In-First-Out order ensures elements are processed in arrival order, which models fairness. A queue is naturally implemented with a doubly ended structure so both ends are cheap."],
        ["Dequeue", "Dequeue removes and returns the element at the front in O(1) — the element that has waited longest leaves first. A common beginner pitfall is implementing a queue with a plain array and removing from the front, which is O(n) because every element shifts; use a deque or a linked list instead. Dequeueing an empty queue is an underflow you must handle."],
      ]},
      { title: "Types", topics: [
        ["Circular Queue", "A circular queue is a fixed-size array whose front and rear indices wrap around to the beginning when they reach the end, reusing slots freed by dequeues. This avoids wasting space or shifting elements, giving O(1) enqueue and dequeue with bounded memory. It is the standard design for ring buffers in streaming, networking, and audio."],
        ["Deque", "A double-ended queue (deque) allows insertion and removal at both the front and the back, all in O(1). It generalises both stacks and queues and is the engine behind sliding-window-maximum (storing useful candidate indices) and many scheduling problems. Most languages provide one (collections.deque, std::deque, ArrayDeque)."],
        ["Priority Queue", "A priority queue serves elements by priority rather than arrival order, always removing the highest- (or lowest-) priority item next, and is almost always implemented with a heap for O(log n) operations. It underlies Dijkstra's shortest path, Huffman coding, task schedulers, and top-K problems. Conceptually it is a queue where 'most important' jumps the line."],
      ]},
      { title: "Applications", topics: [
        ["BFS", "Breadth-First Search explores a graph or tree level by level, using a queue to remember which nodes to visit next; this guarantees it finds the shortest path in an unweighted graph. You enqueue a node's unvisited neighbours and dequeue to process them in waves outward from the source. It is one of the two fundamental graph traversals."],
        ["Scheduling", "Queues model real-world scheduling where requests must be served in order: CPU process scheduling, printer job queues, web-server request handling, and message buffers. The FIFO discipline prevents starvation (everyone eventually gets served), while priority queues handle cases where some jobs are more urgent. This is a core idea in operating systems and distributed systems."],
      ]},
    ],
  },
  {
    id: "hashing", num: 9, title: "Hashing", codeId: "arrays",
    summary: "Map keys to values in about O(1) using a hash function.",
    classes: [
      { title: "Hash Tables", topics: [
        ["Hash Functions", "A hash function converts a key (a number, string, or object) into an array index where its value will be stored, ideally spreading keys uniformly so few share a slot. A good hash is fast to compute and minimises clustering; a poor one that maps many keys to the same index destroys performance. This index computation is what makes lookups average O(1)."],
        ["Collision Handling", "Collisions happen when two different keys hash to the same bucket, and they are unavoidable, so hash tables need a resolution strategy. Chaining stores a small list (or tree) at each bucket and appends colliding entries, while open addressing probes for the next free slot. With a low load factor and good hashing, collisions stay rare and operations stay near O(1); when buckets get crowded, the worst case degrades to O(n)."],
      ]},
      { title: "Applications", topics: [
        ["Frequency Count", "Counting how often each item appears is done in one O(n) pass by incrementing its count in a hash map. This single technique solves anagrams (compare counts), top-K elements, majority element, and first-unique-character problems. It replaces nested comparison loops with a fast lookup table."],
        ["Duplicate Detection", "A hash set detects duplicates in a single pass: as you visit each element, check whether it is already in the set — if so it is a duplicate, otherwise add it. This is O(n) time and O(n) space, far better than the O(n²) of comparing every pair. It also underlies 'contains duplicate', 'happy number', and cycle-detection-by-seen-state problems."],
      ]},
      { title: "Advanced", topics: [
        ["HashMap", "A HashMap stores key→value pairs with average O(1) insert, lookup, and delete by hashing the key to a bucket. When the load factor (entries ÷ buckets) grows too high, it resizes and rehashes all entries to keep operations fast, an occasional O(n) cost amortised across many operations. It is the workhorse behind caches, indexes, and counting, but iteration order is generally not guaranteed."],
        ["HashSet", "A HashSet stores only unique keys (no values) and tests membership in about O(1), making it perfect for de-duplication and 'have I seen this?' checks. It is essentially a HashMap that ignores the value. Use it whenever you need fast existence queries rather than key→value associations."],
      ]},
    ],
  },
  {
    id: "trees", num: 10, title: "Trees", codeId: "trees",
    summary: "Hierarchical nodes; binary trees and BSTs power ordered, searchable data.",
    classes: [
      { title: "Tree Basics", topics: [
        ["Terminology", "A tree is a hierarchy of nodes with one root at the top; each node has a parent (except the root) and zero or more children, and nodes with no children are leaves. Height is the longest path from a node down to a leaf, depth is the distance from the root down to a node, and a subtree is any node together with all its descendants. Knowing whether a binary tree is full, complete, or perfect tells you a lot about its height and how it can be stored."],
        ["Binary Tree", "A binary tree restricts each node to at most two children, conventionally called left and right. This simple constraint makes trees easy to reason about recursively — almost every operation is 'do something with the node, then recurse left and right'. It is the basis for BSTs, heaps, expression trees, and tries."],
      ]},
      { title: "Traversals", topics: [
        ["Inorder", "Inorder traversal visits the left subtree, then the node, then the right subtree. On a binary search tree this yields the values in sorted ascending order, which is why inorder is used to validate a BST or print it sorted. It is naturally recursive but can be done iteratively with a stack."],
        ["Preorder", "Preorder visits the node first, then its left subtree, then its right subtree. Because the root is emitted before its children, preorder is used to copy or serialize a tree (you can rebuild it from the preorder sequence plus structure). It mirrors the order in which a depth-first search discovers nodes."],
        ["Postorder", "Postorder visits the left subtree, then the right subtree, then the node last. Since children are processed before their parent, it is the order for safely deleting/freeing a tree and for computing values that depend on subtree results, like a node's height or subtree sum. It is the natural order for bottom-up tree dynamic programming."],
        ["Level Order", "Level-order (breadth-first) traversal visits all nodes at depth 0, then depth 1, and so on, using a queue. It is used to print a tree by levels, find the minimum depth, perform a zig-zag traversal, or connect nodes at the same level. Unlike the DFS orders above, it explores breadth-first rather than diving deep."],
      ]},
      { title: "Binary Search Tree", topics: [
        ["Insert", "Inserting into a BST compares the new value with the current node and moves left if smaller or right if larger, repeating until it reaches an empty spot where it attaches the new node. This preserves the ordering invariant and costs O(h), where h is the height — O(log n) if balanced, O(n) if the tree has degenerated into a chain. The comparison-driven path is what keeps a BST searchable."],
        ["Delete", "Deleting from a BST handles three cases: a leaf is simply removed, a node with one child is replaced by that child, and a node with two children is replaced by its in-order successor (smallest value in the right subtree), which is then deleted from there. This keeps the BST property intact. It is the trickiest BST operation and a common interview question."],
        ["Search", "Searching a BST walks left or right by comparing the target with each node, just like insertion, finding the value or hitting null in O(h). When the tree is balanced this is O(log n), giving the BST its appeal as an ordered, searchable structure. Searching also generalises to range queries and floor/ceiling lookups."],
      ]},
      { title: "Advanced", topics: [
        ["LCA", "The Lowest Common Ancestor of two nodes is the deepest node that has both of them as descendants. In a BST you find it by walking down from the root until the two target values split to different sides; in a general binary tree you recurse and return the node where the two targets are found in different subtrees. LCA underlies distance-between-nodes and many tree query problems."],
        ["Diameter", "The diameter of a tree is the number of edges on the longest path between any two nodes, which may or may not pass through the root. You compute it in one post-order pass: at each node the longest path through it equals leftHeight + rightHeight, and you track the maximum while returning each node's height. It is a classic example of combining children's results bottom-up."],
        ["Balanced Trees", "An unbalanced BST can degenerate into a linked list with O(n) operations, so self-balancing trees like AVL and Red-Black trees perform rotations on insert and delete to keep the height around log n. AVL trees stay more strictly balanced (faster lookups), while Red-Black trees balance less strictly but rebalance faster (used in Java's TreeMap and C++'s std::map). They guarantee O(log n) worst-case performance."],
      ]},
    ],
  },
  {
    id: "heap", num: 11, title: "Heap", codeId: "heaps",
    summary: "Complete binary tree giving instant access to the smallest or largest element.",
    classes: [
      { title: "Basics", topics: [
        ["Min Heap", "A min-heap is a complete binary tree where every parent is less than or equal to its children, so the smallest element is always at the root and readable in O(1). It is stored compactly in an array (no pointers) where a node at index i has children at 2i+1 and 2i+2. It is the structure behind ascending priority queues and algorithms like Dijkstra."],
        ["Max Heap", "A max-heap is the mirror image: every parent is greater than or equal to its children, so the largest element sits at the root. It is used when you repeatedly need the current maximum, such as scheduling the highest-priority task. Python's heapq is a min-heap, so a common trick is to store negated values to simulate a max-heap."],
      ]},
      { title: "Operations", topics: [
        ["Insert", "To insert, you append the new element at the end of the array (the next open leaf) and then 'sift up', repeatedly swapping it with its parent while it violates the heap order. Because the tree height is log n, this is O(log n). The heap stays complete throughout, which is what keeps the array representation valid."],
        ["Delete", "Removing the root (the min or max) replaces it with the last element, shrinks the array, and then 'sifts down', swapping with the smaller (or larger) child until order is restored — O(log n). This is how you extract elements in sorted order one at a time. Building a heap from an arbitrary array, by contrast, can be done bottom-up in O(n)."],
      ]},
      { title: "Applications", topics: [
        ["Heap Sort", "Heap sort builds a max-heap from the array, then repeatedly swaps the root (largest) to the end and sifts down the reduced heap, producing a sorted array in O(n log n) with O(1) extra space. It is in-place but not stable, and it has reliably good worst-case performance unlike quicksort. It nicely demonstrates the heap as a selection tool."],
        ["Priority Queue", "A heap is the standard implementation of a priority queue, supporting insert and extract-min/max in O(log n) and peek in O(1). This makes it the engine for Dijkstra's and Prim's algorithms, event simulation, Huffman coding, and any 'always process the most important item next' workflow. When you hear 'priority queue', think heap."],
        ["Top K Elements", "To find the k largest elements among n, you keep a min-heap of size k: push each element, and if the heap exceeds k, pop the smallest, so the heap always holds the current top k. This runs in O(n log k), far better than sorting everything when k is small. The same idea (with a max-heap) finds the k smallest, and two heaps maintain a running median."],
      ]},
    ],
  },
  {
    id: "trie", num: 12, title: "Trie", codeId: "tries",
    summary: "Character-keyed tree for blazing-fast prefix and word lookups.",
    classes: [
      { title: "Basics", topics: [
        ["Insert", "Inserting a word into a trie walks down the tree one character at a time, creating a child node whenever the needed character does not yet exist, and marks the final node as the end of a word. This costs O(L), the word's length, independent of how many words are already stored. Shared prefixes reuse the same nodes, which is what makes a trie memory-efficient for dictionaries."],
        ["Search", "Searching follows the characters of the query from the root; if at any point the needed child is missing the word is absent, and if you reach the end the word exists only when that node is flagged as a word end. This distinguishes a stored word from a mere prefix of one. Search is O(L) and never depends on the dictionary size."],
        ["Delete", "Deleting a word unmarks its end-of-word flag and then removes any now-useless nodes — those that are not the end of another word and have no children — walking back up from the leaf. Care is needed not to delete nodes shared by other words. It keeps the trie compact after removals."],
      ]},
      { title: "Applications", topics: [
        ["Auto Complete", "Autocomplete uses a trie by first walking to the node where the typed prefix ends, then collecting every complete word in the subtree below it. Because all words sharing the prefix live under one node, suggestions are gathered very quickly. This is how search bars and IDEs offer instant completions."],
        ["Dictionary Search", "A trie excels at spell-check and word-existence queries: looking up a word is proportional to its length, not the dictionary's size, and prefix queries (does any word start with 'pre'?) are equally fast. It also supports wildcard and approximate matching with a DFS over the tree. These properties make it the backbone of dictionaries, contact search, and IP routing tables."],
      ]},
    ],
  },
  {
    id: "graphs", num: 13, title: "Graphs", codeId: "graphs",
    summary: "Nodes connected by edges — model networks, maps, and dependencies.",
    classes: [
      { title: "Basics", topics: [
        ["Graph Representation", "A graph is a set of nodes (vertices) joined by edges, which may be directed or undirected and weighted or unweighted, modelling roads, social networks, web links, and task dependencies. How you store the edges drives every algorithm's time and space, so you choose between an adjacency matrix and an adjacency list based on how dense the graph is. Getting the representation right is half of solving graph problems."],
        ["Adjacency Matrix", "An adjacency matrix is an n×n grid where cell [i][j] records whether (or how heavily) node i connects to node j, giving O(1) edge lookups but O(n²) memory regardless of how many edges exist. It is best for dense graphs or when you frequently ask 'is there an edge between i and j?'. For sparse graphs it wastes enormous space."],
        ["Adjacency List", "An adjacency list stores, for each node, a list of its neighbours (and edge weights), using only O(V + E) memory, which is ideal for the sparse graphs common in practice. Iterating a node's neighbours is fast, though checking a specific edge is slower than a matrix. It is the default representation for BFS, DFS, Dijkstra, and most real graphs."],
      ]},
      { title: "Traversal", topics: [
        ["BFS", "Breadth-First Search visits nodes in expanding rings from the source using a queue, processing all neighbours before moving farther out, which guarantees the shortest path in an unweighted graph. You mark nodes visited as you enqueue them to avoid revisiting, giving O(V + E). It is used for shortest paths, level computation, bipartite checks, and flood fill."],
        ["DFS", "Depth-First Search dives as deep as possible along each branch before backtracking, implemented with recursion or an explicit stack, also O(V + E). It is the natural choice for detecting cycles, finding connected components, topological sorting, and exploring all paths. The order in which DFS finishes nodes is the key to several advanced algorithms."],
      ]},
      { title: "Shortest Path", topics: [
        ["Dijkstra", "Dijkstra's algorithm finds the shortest path from a source to all nodes when edge weights are non-negative, repeatedly finalising the closest unsettled node (extracted from a min-heap) and relaxing its edges. With a heap it runs in O(E log V). It is the standard for GPS routing and network latency but fails if any edge weight is negative."],
        ["Bellman-Ford", "Bellman-Ford also computes single-source shortest paths but tolerates negative edge weights and can detect negative cycles, by relaxing every edge V-1 times. This robustness costs O(V·E), slower than Dijkstra. It is used in routing protocols and whenever negative weights (like refunds or gains) appear."],
        ["Floyd-Warshall", "Floyd-Warshall computes the shortest path between every pair of nodes using dynamic programming: for each intermediate node k it checks whether going through k shortens any path i→j. It runs in O(V³) and is practical for small, dense graphs where you need all-pairs distances. It also detects negative cycles via negative diagonal entries."],
      ]},
      { title: "Minimum Spanning Tree", topics: [
        ["Prim's Algorithm", "Prim's algorithm builds a minimum spanning tree (the cheapest set of edges connecting all nodes) by growing one tree outward, repeatedly adding the smallest edge that reaches a node not yet in the tree, using a min-heap. It runs in O(E log V) and works well on dense graphs. The MST itself is used in network design and clustering."],
        ["Kruskal's Algorithm", "Kruskal's algorithm builds the MST differently: it sorts all edges by weight and adds them one by one, skipping any edge that would form a cycle, using a Union-Find structure to detect cycles in near-constant time. It runs in O(E log E) and shines on sparse graphs. Both Prim and Kruskal are classic greedy algorithms with provable optimality."],
      ]},
      { title: "Advanced", topics: [
        ["Topological Sort", "A topological sort orders the nodes of a directed acyclic graph (DAG) so that every edge points from earlier to later — perfect for sequencing tasks with dependencies, like build systems or course prerequisites. Kahn's algorithm repeatedly removes nodes with no incoming edges (using a queue), while the DFS method orders nodes by reverse finish time. A valid order exists only if the graph has no cycle."],
        ["Union-Find", "Union-Find (Disjoint Set Union) keeps track of elements partitioned into groups, supporting 'which group is x in?' and 'merge two groups' in nearly constant amortised time thanks to path compression and union by rank. It answers dynamic connectivity questions and powers Kruskal's MST and cycle detection. It is deceptively simple yet appears in many hard problems."],
        ["Strongly Connected Components", "In a directed graph, a strongly connected component is a maximal set of nodes where every node can reach every other node in the set. Tarjan's algorithm finds all SCCs in a single DFS using discovery times and low-link values, while Kosaraju's uses two DFS passes on the graph and its reverse. SCCs reveal cycles and condense a graph into a DAG of components."],
      ]},
    ],
  },
  {
    id: "greedy", num: 14, title: "Greedy Algorithms", codeId: "greedy",
    summary: "Make the locally best choice at each step — valid when it provably gives the global best.",
    classes: [
      { title: "Basics", topics: [
        ["Greedy Strategy", "A greedy algorithm builds a solution step by step, always taking the option that looks best at the moment and never reconsidering past choices, which makes it simple and fast. The catch is that it is only correct when the problem has the 'greedy-choice property' — a locally optimal choice always leads to a globally optimal solution — which you should prove (often via an exchange argument) rather than assume. When greediness fails, the problem usually needs dynamic programming instead."],
      ]},
      { title: "Problems", topics: [
        ["Activity Selection", "Given activities with start and end times, you want the maximum number that do not overlap. The greedy insight is to always pick the activity that finishes earliest, freeing the most room for the rest, after sorting by end time. This O(n log n) approach is provably optimal and is the textbook introduction to greedy correctness."],
        ["Fractional Knapsack", "In the fractional knapsack you fill a weight-limited bag to maximise value, and unlike 0/1 knapsack you may take fractions of an item. The greedy strategy sorts items by value-to-weight ratio and takes the most valuable per kilogram first, splitting the last item to exactly fill the bag. This greedy is optimal precisely because fractions are allowed — the 0/1 version needs DP."],
        ["Job Sequencing", "Given jobs each with a deadline and a profit, where each job takes one unit of time, you maximise total profit by scheduling jobs. The greedy method sorts jobs by descending profit and places each in the latest free time slot at or before its deadline, so high-profit jobs are secured first. It is a clean example of greedy plus a scheduling-slot trick."],
      ]},
    ],
  },
  {
    id: "dp", num: 15, title: "Dynamic Programming", codeId: "dp",
    summary: "Break a problem into overlapping subproblems and solve each one only once.",
    classes: [
      { title: "Basics", topics: [
        ["Memoization", "Memoization is the top-down style of dynamic programming: you write the natural recursion but cache each subproblem's result the first time you compute it, so repeated calls return instantly from the cache. This turns an exponential recursion (like naive Fibonacci) into linear time by ensuring each unique subproblem is solved once. It is easy to add to existing recursion and only computes the subproblems you actually need."],
        ["Tabulation", "Tabulation is the bottom-up style: you identify the base cases and iteratively fill a table from the smallest subproblems up to the answer, with no recursion. It avoids call-stack overhead and makes space optimisation obvious (you can often keep only the last row). The hard part of both styles is defining the state and the transition that relates a state to smaller ones."],
      ]},
      { title: "1-D DP", topics: [
        ["Fibonacci", "Computing Fibonacci with DP stores each F(n) so it is calculated once, dropping the naive O(2^n) recursion to O(n) and, with two rolling variables, O(1) space. It is the simplest example showing overlapping subproblems and the memoization-to-tabulation transition. Almost every DP intuition can be traced back to it."],
        ["Climbing Stairs", "Counting the ways to climb n stairs taking 1 or 2 steps at a time gives the recurrence ways(n) = ways(n-1) + ways(n-2) — the same as Fibonacci, because the last move was either a single or a double step. It teaches you to derive a recurrence by reasoning about the last decision. Recognising this 'count the ways' pattern unlocks many DP problems."],
        ["House Robber", "A robber cannot rob two adjacent houses, so the max loot is dp[i] = max(skip this house = dp[i-1], rob it = dp[i-2] + value[i]). This 'take or skip with a constraint' recurrence is a foundational 1-D DP, solvable in O(n) time and O(1) space. Variants (circular street, binary tree) build directly on it."],
      ]},
      { title: "2-D DP", topics: [
        ["Knapsack", "The 0/1 knapsack chooses a subset of items to maximise value under a weight limit, where each item is either taken or left. The DP state dp[i][w] is the best value using the first i items within weight w, and for each item you take the better of skipping it or including it (value plus the best for the remaining capacity). It is the archetype of 'choose a subset under a constraint' and appears everywhere from budgeting to subset-sum."],
        ["LCS", "The Longest Common Subsequence finds the longest sequence appearing in both strings in the same relative order (not necessarily contiguous). The 2-D DP compares characters: on a match it extends the diagonal subproblem by one, otherwise it takes the better of dropping a character from either string. It underlies diff tools, DNA comparison, and edit-distance-style problems."],
        ["Edit Distance", "Edit distance (Levenshtein) is the minimum number of insertions, deletions, or substitutions to turn one string into another. The DP fills a table where each cell considers the three possible edits plus the 'no change on a match' case, taking the cheapest. It powers spell-checkers, autocorrect, and fuzzy matching, and is a staple 2-D DP interview question."],
      ]},
      { title: "Advanced DP", topics: [
        ["Matrix Chain Multiplication", "Given a chain of matrices, the cost of multiplying them depends on the order of multiplication, and this interval DP finds the cheapest parenthesisation. The state dp[i][j] is the minimum cost to multiply matrices i through j, computed by trying every split point k between them. It introduces interval DP, where you solve over ranges and combine sub-ranges."],
        ["DP on Trees", "DP on trees computes an answer for each node by combining the answers of its children, usually in a post-order traversal — for example, the maximum independent set or 'house robber' on a tree. The state often captures a choice at the node (include it or not) and the transition merges child results accordingly. It generalises 1-D DP to hierarchical structures."],
        ["Bitmask DP", "Bitmask DP encodes a small set (up to ~20 elements) as the bits of an integer and uses that integer as the DP state, letting you track exactly which elements have been used. It solves problems like the Travelling Salesman (shortest route visiting all cities) and optimal assignment, where you must remember a subset. The state space is O(2^n), so it is reserved for small n."],
      ]},
    ],
  },
  {
    id: "bits", num: 16, title: "Bit Manipulation", codeId: "bits",
    summary: "Work directly on binary bits for speed and clever constant-time tricks.",
    classes: [
      { title: "Basics", topics: [
        ["AND (&)", "The bitwise AND sets a result bit to 1 only where both input bits are 1, which makes it the tool for masking (keeping) specific bits and for checking whether a particular bit is set (x & (1<<i)). For example, x & 1 tests whether x is odd. It is also used to clear bits in combination with NOT."],
        ["OR (|)", "The bitwise OR sets a result bit to 1 where either input bit is 1, so it is used to set or turn on specific bits (x | (1<<i) switches bit i on). Combining flags into a single integer (like permission bits) relies on OR. It never turns a 1 back into a 0."],
        ["XOR (^)", "The bitwise XOR sets a bit to 1 only where the two input bits differ, and it has the magical property that a ^ a = 0 and a ^ 0 = a, so identical values cancel out. This makes XOR perfect for finding the single non-duplicated number, swapping two variables without a temporary, and detecting differences. It is the most 'trick-rich' bit operator in interviews."],
        ["NOT (~)", "The bitwise NOT flips every bit (one's complement), turning 0s into 1s and vice versa, and combined with AND it clears a specific bit (x & ~(1<<i)). Because integers are stored in two's complement, ~x equals -(x+1), a fact worth remembering. It is mostly used alongside the other operators to build masks."],
      ]},
      { title: "Problems", topics: [
        ["Power of Two", "A positive number is a power of two exactly when it has a single 1-bit in its binary form, which you can test in O(1) with x > 0 && (x & (x - 1)) == 0. The trick works because subtracting 1 from a power of two flips its lone 1 and all lower 0s, so ANDing gives zero. It is a favourite quick interview question."],
        ["Set Bits", "Counting the number of 1-bits (the population count) can be done by repeatedly clearing the lowest set bit with x &= x - 1 and counting iterations — Brian Kernighan's method runs in O(number of set bits) rather than O(total bits). This count appears in Hamming distance, subset enumeration, and parity checks. Many CPUs even have a dedicated popcount instruction."],
        ["Single Number", "Given an array where every value appears twice except one, XOR-ing all the values together cancels every pair (a ^ a = 0) and leaves just the unique number, solving it in O(n) time and O(1) space. This is the showcase application of XOR's self-cancelling property. Variants (one number appears three times, two unique numbers) extend the idea with bit-by-bit counting or grouping."],
      ]},
      { title: "Advanced", topics: [
        ["Bitmasking", "Bitmasking represents a subset of a small universe of items as the bits of an integer, where bit i being 1 means item i is included, enabling fast set operations (union via OR, intersection via AND, membership via shift-and-AND). It also lets you iterate over all 2^n subsets and, crucially, serve as the state in bitmask dynamic programming. It is essential for problems like the Travelling Salesman and assignment that must remember which elements are used."],
      ]},
    ],
  },
  {
    id: "sorting", num: 17, title: "Sorting Algorithms", codeId: "sorting",
    summary: "Ordering data — a prerequisite step for binary search, two pointers, and greedy.",
    classes: [
      { title: "Basic Sorting", topics: [
        ["Bubble Sort", "Bubble sort repeatedly steps through the list, swapping adjacent elements that are out of order, so the largest 'bubbles up' to the end on each pass — O(n²). It is almost never used in practice but is valuable for understanding swaps, passes, and the idea of an already-sorted early exit. Its only redeeming trait is detecting an already-sorted array in O(n)."],
        ["Selection Sort", "Selection sort divides the array into a sorted and unsorted part, repeatedly finding the minimum of the unsorted part and swapping it into place — O(n²) regardless of input. It makes the fewest swaps (O(n)) of the simple sorts, which can matter when writes are expensive. Like bubble sort, it is mainly educational."],
        ["Insertion Sort", "Insertion sort builds the sorted array one element at a time by inserting each new element into its correct position among the already-sorted prefix, shifting larger elements right. It is O(n²) worst case but O(n) on nearly-sorted data and very fast for small arrays, which is why hybrid sorts (Timsort, introsort) switch to it for small chunks. It is also stable and in-place."],
      ]},
      { title: "Efficient Sorting", topics: [
        ["Merge Sort", "Merge sort is a divide-and-conquer algorithm that splits the array in half, recursively sorts each half, and merges the two sorted halves in linear time, giving a reliable O(n log n) in all cases. It is stable but needs O(n) extra space for the merge buffer, making it ideal for linked lists and external sorting of huge files. The merge step is a fundamental two-pointer technique."],
        ["Quick Sort", "Quick sort picks a pivot, partitions the array so smaller elements go left and larger go right, then recursively sorts each side, all in place. It averages O(n log n) and is usually the fastest in practice due to good cache behaviour, but a poor pivot choice can degrade it to O(n²) — mitigated by randomised or median-of-three pivots. It is the basis of most library sorts for primitive types."],
        ["Heap Sort", "Heap sort builds a max-heap from the array and then repeatedly extracts the maximum to the end, achieving in-place O(n log n) with guaranteed worst-case performance unlike quicksort. The trade-off is that it is not stable and has poorer cache locality, so it is often slower in practice. It elegantly reuses the heap data structure as a sorting tool."],
      ]},
      { title: "Special Sorting", topics: [
        ["Counting Sort", "Counting sort works on integers in a known small range by counting how many times each value occurs and then writing them back in order, achieving O(n + k) where k is the range. It beats comparison sorts' O(n log n) lower bound because it never compares elements. It is stable and forms the inner loop of radix sort, but is impractical when the value range is huge."],
        ["Radix Sort", "Radix sort sorts numbers digit by digit (least significant first), using a stable sub-sort like counting sort for each digit, giving O(d·(n + k)) where d is the number of digits. By avoiding comparisons it can beat O(n log n) for fixed-width integers or strings. It is used for sorting large sets of integers, IDs, and dates."],
        ["Bucket Sort", "Bucket sort distributes elements into several buckets based on their value range, sorts each bucket (often with insertion sort), and concatenates them. When the input is uniformly distributed it runs in about O(n) on average. It is well suited to sorting floating-point numbers in a known range."],
      ]},
    ],
  },
  {
    id: "searching", num: 18, title: "Searching Algorithms", codeId: "binarysearch",
    summary: "Finding an element — or the answer itself — efficiently.",
    classes: [
      { title: "Basics", topics: [
        ["Linear Search", "Linear search checks each element in turn until it finds the target or reaches the end, costing O(n). It is the only option for unsorted data and is perfectly fine for small lists. Its simplicity makes it the baseline you compare faster searches against."],
        ["Binary Search", "Binary search works on sorted data by comparing the target with the middle element and discarding the half that cannot contain it, halving the search space each step for O(log n). The implementation hinges on correct loop bounds (lo <= hi) and mid computation (lo + (hi - lo)/2 to avoid overflow), where off-by-one errors are the classic bug. It is one of the most important and most mis-implemented algorithms."],
      ]},
      { title: "Advanced", topics: [
        ["Binary Search on Answer", "When the answer to a problem is a number and feasibility is monotonic (if X works, everything larger also works), you can binary-search the answer itself rather than an array index. You repeatedly guess a candidate value and run a feasibility check, narrowing the range — used in problems like minimum ship capacity, Koko eating bananas, and splitting an array. Recognising the monotonic structure is the whole skill."],
        ["Lower Bound", "The lower bound of a target in a sorted array is the index of the first element greater than or equal to it, i.e. the leftmost position where the target could be inserted while keeping order. It is computed with a binary-search variant that moves right past anything strictly smaller. It answers 'how many elements are below X?' and supports range/count queries."],
        ["Upper Bound", "The upper bound is the index of the first element strictly greater than the target — the position just past the last occurrence of the target. Together, lower and upper bound let you count occurrences of a value (upper - lower) and find ranges in sorted data in O(log n). Most languages provide them (bisect_left/bisect_right, lower_bound/upper_bound)."],
      ]},
    ],
  },
  {
    id: "advanced", num: 19, title: "Advanced Topics",
    summary: "Specialized structures for fast range queries and tough constraints.",
    classes: [
      { title: "Segment Tree", topics: [
        ["Segment Tree", "A segment tree is a binary tree built over the ranges of an array, where each node stores an aggregate (sum, min, max, gcd) of a sub-range, enabling both range queries and updates in O(log n). It is the go-to structure when an array changes between queries and a static prefix-sum array would be too slow to rebuild. With lazy propagation it even supports range updates (add a value to a whole range) efficiently, making it a competitive-programming staple."],
      ]},
      { title: "Fenwick Tree (BIT)", topics: [
        ["Fenwick Tree (BIT)", "A Fenwick tree, or Binary Indexed Tree, supports prefix-sum queries and point updates in O(log n) using a compact array and the lowest-set-bit trick (i & -i) to jump between responsible ranges. It does less than a segment tree but is simpler to code and uses less memory, which is why it is preferred for cumulative-frequency and inversion-count problems. It is one of the most elegant uses of bit manipulation in data structures."],
      ]},
      { title: "Sparse Table", topics: [
        ["Sparse Table", "A sparse table precomputes answers for every interval whose length is a power of two, so idempotent range queries like minimum, maximum, or gcd are answered in O(1) after O(n log n) preprocessing. The catch is that it only works on static arrays that do not change, since updates would require rebuilding. It is the fastest option for repeated range-minimum queries on fixed data."],
      ]},
      { title: "Disjoint Set Union (DSU)", topics: [
        ["Disjoint Set Union (DSU)", "DSU (Union-Find) maintains a partition of elements into disjoint groups and answers 'are x and y connected?' and 'merge their groups' in nearly constant amortised time, thanks to path compression (flattening the tree on find) and union by rank/size. It is the engine behind Kruskal's MST, cycle detection in undirected graphs, and dynamic connectivity. Its near-O(1) performance comes from the inverse-Ackermann function, effectively a constant."],
      ]},
      { title: "Mo's Algorithm", topics: [
        ["Mo's Algorithm", "Mo's algorithm answers many offline range queries (you know all queries in advance) by cleverly ordering them and moving two pointers to add/remove elements incrementally, achieving about O((n + q)·√n). It is used when no clean per-query data structure exists but you can update an answer by adding or removing one element at a time. Sorting queries into √n-sized blocks is the key trick."],
      ]},
      { title: "Heavy-Light Decomposition", topics: [
        ["Heavy-Light Decomposition", "Heavy-light decomposition splits a tree into a set of vertical chains so that any root-to-node path crosses only O(log n) chains, letting you answer path queries (sum/max along a path) with a segment tree over each chain in O(log²n). It transforms hard tree-path problems into familiar array-range problems. It is an advanced competitive-programming technique built on top of segment trees."],
      ]},
    ],
  },
  {
    id: "cp", num: 20, title: "Competitive Programming Topics",
    summary: "Math and number theory that appear in contests and some interviews.",
    classes: [
      { title: "Mathematics", topics: [
        ["GCD", "The greatest common divisor of two numbers is the largest integer dividing both, computed efficiently by Euclid's algorithm: gcd(a, b) = gcd(b, a mod b) until the remainder is zero. It runs in O(log min(a, b)) and is the foundation for simplifying fractions, the LCM, and modular inverses. Its recursive elegance makes it a classic first number-theory algorithm."],
        ["LCM", "The least common multiple is the smallest number that both inputs divide evenly, and it is computed from the GCD as a × b / gcd(a, b) — dividing first avoids overflow. It answers 'when do two repeating cycles align?' problems, like meeting points of periodic events. Understanding the GCD–LCM relationship is essential number-theory fluency."],
        ["Modular Arithmetic", "Modular arithmetic works with remainders after division by a modulus m, so numbers 'wrap around' (like a clock), and it keeps huge results manageable by taking everything mod m. Properties like (a + b) mod m = ((a mod m) + (b mod m)) mod m let you compute factorials, powers, and combinatorics for enormous numbers without overflow. It is everywhere in contests, hashing, and cryptography, often with a prime modulus like 1e9+7."],
      ]},
      { title: "Number Theory", topics: [
        ["Sieve of Eratosthenes", "The Sieve of Eratosthenes finds all prime numbers up to n by starting with all numbers marked prime and repeatedly crossing out the multiples of each prime it finds, leaving only primes — O(n log log n). It is dramatically faster than testing each number individually and precomputes primes for many later queries. A small extension (smallest prime factor) enables fast factorisation."],
        ["Prime Factorization", "Prime factorisation breaks a number into the product of its prime factors, found by trial-dividing by each candidate up to its square root (since a larger factor would pair with a smaller one already found). This runs in O(√n) per number, or far faster with a precomputed sieve of smallest prime factors. Factorisation underpins divisor counting, GCD/LCM, and many contest problems."],
      ]},
      { title: "Combinatorics & Probability", topics: [
        ["Combinatorics", "Combinatorics is the mathematics of counting arrangements without listing them: permutations (nPr) count ordered selections where order matters, while combinations (nCr) count unordered selections where it does not. Mastering factorials, Pascal's triangle, and the formula nCr = n! / (r!(n-r)!) — usually computed mod a prime — lets you count paths, subsets, and outcomes instantly. It is the backbone of probability and many DP state counts."],
        ["Probability", "Probability measures how likely an event is, from 0 (impossible) to 1 (certain), and expected value is the long-run average outcome weighted by probability. In algorithms it justifies randomised methods (randomised quicksort, hashing) and solves expected-cost problems, often combined with DP over states. Reasoning about expectation and linearity of expectation is a powerful contest tool."],
      ]},
    ],
  },
];

export const learningOrder = [
  "Programming Basics", "Time Complexity", "Arrays", "Strings", "Recursion",
  "Linked List", "Stack", "Queue", "Hashing", "Binary Search", "Sorting",
  "Trees", "Heap", "Trie", "Graphs", "Greedy", "Dynamic Programming",
  "Bit Manipulation", "Segment Tree / DSU", "Competitive Programming",
];
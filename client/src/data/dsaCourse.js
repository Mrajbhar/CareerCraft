// ===> place at: client/src/data/dsaCourse.js
// Full DSA course written in simple beginner-friendly language with analogies.
// 20 modules -> classes -> [topic, plain-English explanation].
// `codeId` (optional) links a module to a coded topic in dsaTheory.js for the example.

export const dsaCourse = [
  {
    id: "fundamentals",
    num: 1,
    title: "Programming Fundamentals",
    summary: "The very first building blocks of any program — start here.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Variables",
            "A variable is a labeled box that holds a value. You give it a name and put something inside, like score = 10. Later you can read it or change what is inside. Think of it like a labeled jar in your kitchen.",
          ],
          [
            "Data Types",
            "A data type is the kind of value a box can hold. Whole numbers are int, decimals are float, true or false is boolean, and text is string. The type tells the computer how to handle the value. You cannot mix a word and a number, just like you cannot mix oil and water.",
          ],
          [
            "Operators",
            "Operators are symbols that do an action on values. Plus, minus, times and divide do math. Double-equals checks if two things are the same. And and or join conditions together. They are the verbs of programming.",
          ],
          [
            "Input / Output",
            "Input is data coming into your program, like typing on the keyboard. Output is your program showing a result, like printing on the screen. In Python you use input() to read and print() to show. It is like a conversation: you ask, the program answers.",
          ],
          [
            "Type Casting",
            "Type casting means changing a value from one type to another. The text '42' is not a number until you convert it with int('42'). Turning 3.9 into an int gives 3, not 4, because it just drops the decimal. So be careful, some conversions lose information.",
          ],
        ],
      },
      {
        title: "Control Flow",
        topics: [
          [
            "if / else",
            "An if statement runs code only when something is true. The else part runs when it is false. This is how a program makes a choice. Example: if it is raining, take an umbrella, else wear sunglasses.",
          ],
          [
            "switch",
            "A switch picks one option out of many based on a single value. It is cleaner than writing many if-else lines. Think of a TV remote: press 1 for channel one, 2 for channel two. Each case is one channel.",
          ],
          [
            "Loops (for, while, do-while)",
            "A loop repeats the same code many times so you do not copy and paste. Use for when you know how many times, like print 1 to 10. Use while to repeat until something happens, like asking for a password until it is correct. Every loop needs a way to stop.",
          ],
          [
            "break / continue",
            "break stops a loop right away and jumps out. continue skips the rest of this round and starts the next one. Example: break when you find your item, or continue to skip the bad ones. They keep loops simple.",
          ],
        ],
      },
      {
        title: "Functions",
        topics: [
          [
            "Function Declaration",
            "A function is a named block of code you can use again and again. You write it once and call it whenever you need it. It is like a recipe: write it once, cook it many times. A good name tells you what it does, like calculateTotal.",
          ],
          [
            "Parameters",
            "Parameters are the inputs you give a function so it can work on different data. add(a, b) takes two numbers. When you call add(3, 5), the 3 and 5 go into a and b. They are like ingredients you hand to a recipe.",
          ],
          [
            "Return Types",
            "Return is the answer a function gives back to you. If a function returns a number, you can save or use that number. A function that returns nothing just does an action. return also ends the function right there.",
          ],
          [
            "Recursion Basics",
            "Recursion is when a function calls itself to solve a smaller piece of the same problem. It needs a stopping point called the base case, or it runs forever. Think of two mirrors facing each other: the image repeats smaller and smaller. It is great for things that repeat in a pattern.",
          ],
        ],
      },
    ],
  },
  {
    id: "complexity",
    num: 2,
    title: "Time & Space Complexity",
    summary: "A simple way to check if your code is fast and light enough.",
    classes: [
      {
        title: "Complexity Analysis",
        topics: [
          [
            "Big O Notation",
            "Big O tells you how slow your code gets as the data grows. O(1) is super fast and does not care about size. O(n) gets slower as the list gets bigger. O(n squared) gets very slow very fast. It helps you compare which solution can handle big data.",
          ],
          [
            "Omega (Ω)",
            "Omega is the best case, the fewest steps possible. Example: when searching a list, the item might be the very first one, so just one step. It tells you how fast things can go when you are lucky. It is used less than Big O.",
          ],
          [
            "Theta (Θ)",
            "Theta is used when the best case and worst case take the same time. Example: adding all numbers in a list always touches every number. So it is always n steps, no more and no less. It is the most exact way to describe speed.",
          ],
        ],
      },
      {
        title: "Complexity Calculation",
        topics: [
          [
            "Loop Analysis",
            "One loop over n items takes n steps, so it is O(n). The work inside the loop adds to the cost. If each step is simple, it stays O(n). Just count how many times the loop runs.",
          ],
          [
            "Nested Loops",
            "A loop inside another loop multiplies. An n loop inside an n loop gives n times n, which is O(n squared). This is usually slow for big data. Seeing two nested loops is a hint you might speed it up.",
          ],
          [
            "Recursive Complexity",
            "For recursion, count how many calls happen and the work in each. Merge sort splits in half each time and does n work, giving O(n log n). Drawing the calls as a tree helps you count. More calls means more time.",
          ],
        ],
      },
      {
        title: "Space Complexity",
        topics: [
          [
            "Auxiliary Space",
            "Auxiliary space is the extra memory you use besides the input. Things like temporary arrays and the recursion stack count here. Using less extra memory is better. Often you trade memory for speed, or the other way around.",
          ],
          [
            "Memory Usage",
            "Memory usage is the total memory your program needs. This includes the input plus any helpers. A hash map uses more memory but makes things faster. You balance speed against the memory your computer has.",
          ],
        ],
      },
    ],
  },
  {
    id: "arrays",
    num: 3,
    title: "Arrays",
    codeId: "arrays",
    summary:
      "A row of boxes you can jump into instantly — the most-used structure.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Array Declaration",
            "An array is a row of boxes placed side by side in memory. Each box has a number called an index, starting from 0. Because they are side by side, you can jump to any box instantly. Like seats in a row, seat number five is easy to find.",
          ],
          [
            "Traversal",
            "Traversal means visiting each box one by one with a loop. It takes n steps for n items. You use it to add, search, or change things. It is the most basic array skill.",
          ],
          [
            "Insertion",
            "Adding at the end of an array is fast. Adding in the middle is slow because everything after it must shift right to make room. Imagine adding a person in the middle of a queue: everyone behind moves back. That shifting costs time.",
          ],
          [
            "Deletion",
            "Removing from the middle is slow because everything after it shifts left to fill the gap. Removing from the end is fast. A trick: if order does not matter, swap with the last item and remove the end. That makes it fast.",
          ],
        ],
      },
      {
        title: "Intermediate",
        topics: [
          [
            "Searching",
            "To find an item in an unsorted array, you check each one, which is O(n). If the array is sorted, binary search is much faster at O(log n). Sorting first pays off if you search many times. Choose based on whether your data is sorted.",
          ],
          [
            "Updating",
            "Changing a value at a known index is instant, O(1). You jump straight to that box. This is why arrays are great for lookup tables. Fast read and write by index is the array's superpower.",
          ],
          [
            "Rotations",
            "Rotating moves every item left or right by some steps, wrapping around the ends. The slow way moves one item at a time. The smart way reverses parts of the array to do it fast in O(n). Useful for circular things like schedules.",
          ],
        ],
      },
      {
        title: "Advanced",
        topics: [
          [
            "Prefix Sum",
            "A prefix sum stores running totals so you can get the sum of any range instantly. First you spend O(n) to build it. After that, any range sum is O(1). It is like keeping a running total of your spending so far.",
          ],
          [
            "Kadane's Algorithm",
            "Kadane finds the part of the array with the biggest sum in one pass. It keeps adding numbers but restarts when the total goes negative. It remembers the best total seen. Simple and fast at O(n).",
          ],
          [
            "Sliding Window",
            "A sliding window is a range that moves across the array. Instead of recalculating each time, you add the new item and remove the old one. Great for things like the best sum of k items. It turns slow O(n squared) into fast O(n).",
          ],
          [
            "Two Pointers",
            "Two pointers use two markers moving through the data. They may start at both ends and move inward, or move at different speeds. This avoids a slow double loop. Common for sorted arrays and finding pairs.",
          ],
        ],
      },
    ],
  },
  {
    id: "strings",
    num: 4,
    title: "Strings",
    summary:
      "Working with text — plus clever ways to find a word inside a text.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "String Operations",
            "A string is just text, a row of characters. You can find its length, join two strings, or cut out a part. In many languages a string cannot be changed once made. So building text in a loop with plus is slow; collect the parts and join at the end.",
          ],
          [
            "Character Arrays",
            "A string is really an array of characters. Turning it into a character array lets you change letters in place. Letters are stored as numbers called codes, so 'a' minus 'a' is 0. This trick lets you count letters easily.",
          ],
        ],
      },
      {
        title: "Intermediate",
        topics: [
          [
            "String Reversal",
            "Reversing flips the text back to front, like abc into cba. Use two pointers, one at each end, and swap as they move inward. It takes O(n). It is a building block for palindrome checks.",
          ],
          [
            "Palindrome",
            "A palindrome reads the same forwards and backwards, like madam. Check it with one pointer at the start and one at the end, comparing as they move in. If all letters match, it is a palindrome. Simple and O(n).",
          ],
          [
            "Anagrams",
            "Two words are anagrams if they use the same letters, just rearranged, like listen and silent. Count each letter in both words and compare the counts. If the counts match, they are anagrams. Counting is faster than sorting.",
          ],
        ],
      },
      {
        title: "Advanced",
        topics: [
          [
            "Pattern Matching",
            "Pattern matching means finding a small word inside a big text. The simple way checks every position, which can be slow at O(n times m). The smart algorithms below skip work and run faster. Think of finding a word on a page.",
          ],
          [
            "KMP Algorithm",
            "KMP avoids rechecking letters it already matched. It builds a small helper table from the pattern first. On a mismatch, it jumps ahead smartly instead of starting over. This makes searching fast at O(n plus m).",
          ],
          [
            "Rabin-Karp",
            "Rabin-Karp turns the pattern into a number called a hash and slides a window over the text comparing numbers. Comparing numbers is faster than comparing letters. If the numbers match, it double-checks the letters. Good for searching many patterns at once.",
          ],
          [
            "Z Algorithm",
            "The Z algorithm builds a list that says how much each spot matches the start of the text. Using it, you can find the pattern everywhere in linear time. It is popular in contests. It gives clean O(n plus m) search.",
          ],
        ],
      },
    ],
  },
  {
    id: "recursion",
    num: 5,
    title: "Recursion & Backtracking",
    codeId: "backtracking",
    summary:
      "A function that calls itself, then a smart way to try and undo choices.",
    classes: [
      {
        title: "Recursion Basics",
        topics: [
          [
            "Recursive Functions",
            "A recursive function solves a big problem by calling itself on a smaller part. Each call must get closer to the stopping point. Trust that the smaller call works, then combine the result. It is great for trees and divide-and-conquer.",
          ],
          [
            "Base Case",
            "The base case is when the function stops and returns an answer directly. Without it, the function calls itself forever and crashes. Example: factorial stops at 0! = 1. Always write the base case first.",
          ],
          [
            "Call Stack",
            "Every function call is stacked like plates, one on top of another. When a call finishes, its plate is removed and the one below continues. Deep recursion uses a lot of stack memory and can crash. Picturing this stack helps you debug.",
          ],
        ],
      },
      {
        title: "Problems",
        topics: [
          [
            "Factorial",
            "Factorial means n times all numbers below it, like 4! = 4 x 3 x 2 x 1. In recursion, n! = n times (n-1)!, stopping at 0! = 1. It is the classic first recursion example. Easy to see how it unwinds.",
          ],
          [
            "Fibonacci",
            "Fibonacci numbers add the two before them: 0, 1, 1, 2, 3, 5, 8. Plain recursion is very slow because it repeats work. Saving answers, called memoization, makes it fast. It is the bridge to dynamic programming.",
          ],
          [
            "Power Function",
            "To compute x to the power n fast, square the half power: x to the n = (x to the n/2) squared. This does it in O(log n) instead of multiplying n times. It is used a lot in math. A neat recursion trick.",
          ],
        ],
      },
      {
        title: "Backtracking",
        topics: [
          [
            "N-Queens",
            "Place queens on a chessboard so none attack each other. Try a spot, move to the next row, and go back if it does not work. This try-and-undo idea is backtracking. It teaches the choose, explore, undo pattern.",
          ],
          [
            "Sudoku Solver",
            "Fill empty cells with digits that do not break the rules. Place a digit, move on, and undo if you get stuck. Keep trying until the board is full. It is a puzzle solved by smart guessing.",
          ],
          [
            "Rat in a Maze",
            "Find a path from the start to the end in a grid. Move in a direction, mark the cell, and go back if blocked. Unmark when you backtrack so cells can be reused later. It is the base of many grid problems.",
          ],
          [
            "Permutations",
            "Permutations are all the orders of a set, like ABC, ACB, BAC. Fix one item, arrange the rest, then undo and try the next. There are n factorial of them. This pattern also unlocks subsets and combinations.",
          ],
        ],
      },
    ],
  },
  {
    id: "linkedlist",
    num: 6,
    title: "Linked List",
    codeId: "linkedlist",
    summary: "Boxes linked by arrows — easy to add and remove, but no jumping.",
    classes: [
      {
        title: "Singly Linked List",
        topics: [
          [
            "Node Structure",
            "A linked list is a chain of boxes called nodes. Each node holds a value and an arrow pointing to the next node. They are not side by side in memory, just connected by arrows. It is like a treasure hunt where each clue points to the next.",
          ],
          [
            "Insertion",
            "To add a node, you just change a few arrows to point to it. This is fast, O(1), once you are at the spot. There is no shifting like in arrays. Just link the arrows in the right order so you do not lose the rest.",
          ],
          [
            "Deletion",
            "To delete a node, point the previous node's arrow past it. The skipped node is then gone. This is O(1) if you have the previous node. A dummy first node makes the edge cases easier.",
          ],
          [
            "Traversal",
            "To visit nodes, start at the head and follow arrows until you reach the end. It takes O(n). You cannot jump to the middle; you must walk there. Most list tricks use one or two moving pointers.",
          ],
        ],
      },
      {
        title: "Doubly Linked List",
        topics: [
          [
            "Insert / Delete",
            "A doubly linked list has arrows both ways: next and previous. So you can delete a node in O(1) without finding the one before it. It uses a bit more memory for the extra arrow. It powers things like the LRU cache.",
          ],
          [
            "Forward & Backward Traversal",
            "Because each node knows the previous one, you can move both ways. This is great for browser back and forward, and undo and redo. A singly list cannot easily go backward. The cost is keeping one more arrow updated.",
          ],
        ],
      },
      {
        title: "Circular Linked List",
        topics: [
          [
            "Operations",
            "In a circular list, the last node points back to the first, making a ring. It is good for taking turns in order and looping playlists. Be careful to stop after one full loop, since there is no end. Otherwise you loop forever.",
          ],
        ],
      },
      {
        title: "Advanced",
        topics: [
          [
            "Reverse List",
            "Reversing flips all the arrows so the last node becomes the first. Use three pointers, previous, current and next, and flip one arrow at a time. It is O(n) time and O(1) space. A very common interview question.",
          ],
          [
            "Detect Cycle",
            "A cycle is when the list loops back on itself. Use a slow pointer and a fast pointer; if they ever meet, there is a loop. This is Floyd's trick and uses no extra memory. Smart and clean.",
          ],
          [
            "Merge Lists",
            "Merging two sorted lists weaves them into one sorted list by picking the smaller head each time. A dummy node keeps the code simple. For many lists, use a heap. This is the merge step of merge sort.",
          ],
        ],
      },
    ],
  },
  {
    id: "stack",
    num: 7,
    title: "Stack",
    codeId: "stackqueue",
    summary: "Last in, first out — like a stack of plates.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Push",
            "Push means put an item on top of the stack. It is fast, O(1). A stack only grows and shrinks at the top. It is like adding a plate to a pile.",
          ],
          [
            "Pop",
            "Pop means take the top item off. The last item you put in comes out first. This is called LIFO. It is like taking the top plate from the pile.",
          ],
          [
            "Peek",
            "Peek means look at the top item without removing it. It lets you check before you decide to pop. It is like looking at the top plate but not taking it. Always check the stack is not empty first.",
          ],
        ],
      },
      {
        title: "Applications",
        topics: [
          [
            "Balanced Parentheses",
            "To check that brackets match, push each opening bracket and pop when you see a closing one. If they pair up and the stack ends empty, it is balanced. It is like making sure every open bracket has a close. This is the classic stack use.",
          ],
          [
            "Infix to Postfix",
            "We write math like a plus b, but computers prefer a b plus. A stack reorders the operators by their priority. This is the shunting-yard method. It is how calculators understand math.",
          ],
          [
            "Expression Evaluation",
            "To solve a postfix expression, push the numbers and apply each operator to the top two. The last number left is the answer. It is simple and fast. It pairs naturally with infix-to-postfix.",
          ],
        ],
      },
      {
        title: "Advanced",
        topics: [
          [
            "Monotonic Stack",
            "A monotonic stack keeps items in order, all increasing or all decreasing. It pops items that break the order. This finds the next bigger or smaller item quickly in O(n). It is used in problems like daily temperatures.",
          ],
          [
            "Next Greater Element",
            "For each number, find the next bigger number to its right. A stack lets you do this in one pass. Each item is pushed and popped once, so it is O(n). Much faster than checking every pair.",
          ],
        ],
      },
    ],
  },
  {
    id: "queue",
    num: 8,
    title: "Queue",
    codeId: "stackqueue",
    summary: "First in, first out — like a line at a shop.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Enqueue",
            "Enqueue means add to the back of the line, O(1). The first one in line is served first. This is FIFO, like a real queue at a shop. Fair order for everyone.",
          ],
          [
            "Dequeue",
            "Dequeue means remove from the front, O(1). The one who waited longest goes first. Do not remove from the front of a normal array, it is slow. Use a deque or a linked list instead.",
          ],
        ],
      },
      {
        title: "Types",
        topics: [
          [
            "Circular Queue",
            "A circular queue reuses freed front slots by wrapping around a fixed array. This saves space and avoids shifting. It is used in buffers for audio and networking. Like a circular track of fixed size.",
          ],
          [
            "Deque",
            "A deque lets you add and remove from both ends, all O(1). It is more flexible than a stack or queue. It is used in sliding window problems. The name means double-ended queue.",
          ],
          [
            "Priority Queue",
            "A priority queue serves the most important item first, not the oldest. It is built with a heap. It is used in shortest path and task scheduling. Like a hospital treating the most urgent patient first.",
          ],
        ],
      },
      {
        title: "Applications",
        topics: [
          [
            "BFS",
            "BFS explores a graph level by level using a queue. It finds the shortest path when edges have no weight. You visit neighbors in waves moving outward. One of the two main ways to explore graphs.",
          ],
          [
            "Scheduling",
            "Queues model waiting lines for CPU tasks, printers, and web requests. Everyone is served in order so no one is forgotten. Priority queues handle urgent jobs first. It is a core idea in operating systems.",
          ],
        ],
      },
    ],
  },
  {
    id: "hashing",
    num: 9,
    title: "Hashing",
    codeId: "arrays",
    summary: "Find a value almost instantly using a key.",
    classes: [
      {
        title: "Hash Tables",
        topics: [
          [
            "Hash Functions",
            "A hash function turns a key into a slot number where its value is kept. A good one spreads keys evenly so few clash. This is what makes lookups almost instant. It is like giving each name a locker number.",
          ],
          [
            "Collision Handling",
            "A collision is when two keys get the same slot. We handle it by keeping a small list in that slot, or by finding the next free slot. With good spreading, clashes are rare. Then lookups stay near O(1).",
          ],
        ],
      },
      {
        title: "Applications",
        topics: [
          [
            "Frequency Count",
            "To count how often items appear, add them to a map and increase their count. This is one pass, O(n). It solves anagrams, top-K, and majority element. A very common trick.",
          ],
          [
            "Duplicate Detection",
            "To find duplicates, add each item to a set and check if it was already there. If yes, it is a duplicate. This is O(n), much faster than comparing every pair. A set remembers what you have seen.",
          ],
        ],
      },
      {
        title: "Advanced",
        topics: [
          [
            "HashMap",
            "A HashMap stores key and value pairs with fast get and put, about O(1). When it gets full, it resizes and reorganizes everything. It is used for caches and counting. The order of items is not guaranteed.",
          ],
          [
            "HashSet",
            "A HashSet stores only unique keys, no values. It checks 'have I seen this?' in about O(1). Use it to remove duplicates. It is a HashMap that ignores values.",
          ],
        ],
      },
    ],
  },
  {
    id: "trees",
    num: 10,
    title: "Trees",
    codeId: "trees",
    summary: "An upside-down family tree of nodes — searchable and organized.",
    classes: [
      {
        title: "Tree Basics",
        topics: [
          [
            "Terminology",
            "A tree is a family-like structure with one top node called the root. Each node has children below it; a node with no children is a leaf. Height is the longest path down to a leaf. It is like a family tree drawn upside down.",
          ],
          [
            "Binary Tree",
            "A binary tree gives each node at most two children, a left and a right. This simple rule makes trees easy to handle with recursion. It is the base for search trees, heaps, and more. Most tree code does: handle the node, then go left and right.",
          ],
        ],
      },
      {
        title: "Traversals",
        topics: [
          [
            "Inorder",
            "Inorder visits left, then the node, then right. On a search tree this gives values in sorted order. It is used to print a tree sorted or to check it. A key traversal to know.",
          ],
          [
            "Preorder",
            "Preorder visits the node first, then left, then right. Because the root comes first, it is used to copy a tree. It matches how a DFS discovers nodes. Root first, then children.",
          ],
          [
            "Postorder",
            "Postorder visits left, then right, then the node last. The children are done before the parent. It is used to delete a tree or add up child results. Good for bottom-up work.",
          ],
          [
            "Level Order",
            "Level order visits the tree row by row using a queue. It goes breadth-first. It is used to print levels or find the smallest depth. Unlike the others, it goes wide, not deep.",
          ],
        ],
      },
      {
        title: "Binary Search Tree",
        topics: [
          [
            "Insert",
            "To insert in a search tree, go left if smaller and right if bigger, until you find an empty spot. This keeps the tree ordered. It takes O(h), the height. Balanced trees keep this fast.",
          ],
          [
            "Delete",
            "Deleting handles three cases: a leaf is just removed, one child replaces the node, and two children means swap with the next bigger value then remove that. This keeps the order. It is the trickiest tree operation.",
          ],
          [
            "Search",
            "To search, compare and go left or right until found, or until you hit empty. It is O(h). Balanced trees make this O(log n). This ordered search is why search trees are useful.",
          ],
        ],
      },
      {
        title: "Advanced",
        topics: [
          [
            "LCA",
            "The lowest common ancestor is the deepest node that is a parent of both target nodes. In a search tree, walk down until the two values split left and right. It answers where two nodes meet. It is used in distance problems.",
          ],
          [
            "Diameter",
            "The diameter is the longest path between any two nodes. At each node it is the left height plus the right height. Track the biggest while you compute heights. A classic bottom-up tree problem.",
          ],
          [
            "Balanced Trees",
            "An unbalanced tree can turn into a slow chain. AVL and Red-Black trees rotate to stay balanced, keeping height about log n. This guarantees fast O(log n) operations. Java and C++ maps use them.",
          ],
        ],
      },
    ],
  },
  {
    id: "heap",
    num: 11,
    title: "Heap",
    codeId: "heaps",
    summary: "Always gives you the smallest or largest item instantly.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Min Heap",
            "A min heap is a tree where each parent is smaller than its children. So the smallest item is always on top. It is stored in an array, no arrows needed. Great for always grabbing the smallest.",
          ],
          [
            "Max Heap",
            "A max heap is the opposite: each parent is bigger, so the largest is on top. Use it when you need the biggest each time. Python's heap is a min heap, so store negatives for a max heap. Same idea, flipped.",
          ],
        ],
      },
      {
        title: "Operations",
        topics: [
          [
            "Insert",
            "To insert, add the item at the end and bubble it up while it is smaller than its parent. This keeps the heap in order. It is O(log n) because the tree is short. The shape stays neat.",
          ],
          [
            "Delete",
            "To remove the top, put the last item on top and sink it down to its place. This gives you the smallest or largest. It is O(log n). Repeat this to get items in sorted order.",
          ],
        ],
      },
      {
        title: "Applications",
        topics: [
          [
            "Heap Sort",
            "Heap sort builds a heap, then keeps removing the top into the sorted spot. It is O(n log n) and in place. It always performs well, unlike quicksort's bad cases. It shows the heap as a sorting tool.",
          ],
          [
            "Priority Queue",
            "A heap is the standard priority queue. It hands you the most important item fast. It is used in Dijkstra, scheduling, and Huffman coding. When you hear priority queue, think heap.",
          ],
          [
            "Top K Elements",
            "To get the k biggest items, keep a small heap of size k. Add each item and drop the smallest if it grows past k. This is O(n log k), fast when k is small. Two heaps can even track a running middle value.",
          ],
        ],
      },
    ],
  },
  {
    id: "trie",
    num: 12,
    title: "Trie",
    codeId: "tries",
    summary: "A tree of letters for super-fast word and prefix search.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Insert",
            "To add a word, walk down letter by letter, making nodes as needed, and mark the end. It takes O(L), the word length. Words that share a start share nodes. This saves memory for dictionaries.",
          ],
          [
            "Search",
            "To find a word, follow its letters from the top. If a letter is missing, the word is not there. The word counts only if it ends on a word-end mark. Speed depends on the word length, not the dictionary size.",
          ],
          [
            "Delete",
            "To delete, unmark the word end and remove useless nodes that lead nowhere. Be careful not to remove nodes shared with other words. It keeps the trie small. Walk back up from the leaf.",
          ],
        ],
      },
      {
        title: "Applications",
        topics: [
          [
            "Auto Complete",
            "Type a few letters, and the trie finds the node where they end. Then it lists all the words below that node. This gives instant suggestions. It is how a search bar autocompletes.",
          ],
          [
            "Dictionary Search",
            "A trie checks if a word exists fast, based on its length. Prefix questions like 'any word starting with pre?' are also fast. It is used in spell-check and contact search. Very efficient for words.",
          ],
        ],
      },
    ],
  },
  {
    id: "graphs",
    num: 13,
    title: "Graphs",
    codeId: "graphs",
    summary: "Dots joined by lines — used for maps, friends, and dependencies.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Graph Representation",
            "A graph is dots called nodes joined by lines called edges. It models maps, friends, and task dependencies. Edges can have a direction and a weight. How you store the edges affects speed.",
          ],
          [
            "Adjacency Matrix",
            "A matrix is a grid where cell i j says if i connects to j. Checking an edge is instant, but it uses n times n memory. It is good for dense graphs with many edges. Wasteful when edges are few.",
          ],
          [
            "Adjacency List",
            "An adjacency list keeps each node's neighbors in a list. It uses little memory, O(V plus E). It is best for sparse graphs, which are most real ones. It is the default choice for graph problems.",
          ],
        ],
      },
      {
        title: "Traversal",
        topics: [
          [
            "BFS",
            "BFS explores in rings moving outward using a queue. It finds the shortest path when edges have no weight. Mark nodes visited so you do not repeat them. It is used for shortest paths and levels.",
          ],
          [
            "DFS",
            "DFS goes as deep as possible, then backs up. It uses recursion or a stack. It is good for cycles, connectivity, and ordering tasks. One of the two core traversals.",
          ],
        ],
      },
      {
        title: "Shortest Path",
        topics: [
          [
            "Dijkstra",
            "Dijkstra finds shortest paths when weights are not negative. It always picks the closest unfinished node next, using a heap. It runs in O(E log V). It is used in GPS and maps.",
          ],
          [
            "Bellman-Ford",
            "Bellman-Ford also finds shortest paths but allows negative weights. It relaxes all edges many times. It is slower at O(V times E) but more general. It can also spot negative loops.",
          ],
          [
            "Floyd-Warshall",
            "Floyd-Warshall finds shortest paths between every pair of nodes. It tries going through each node as a middle step. It is O(V cubed), good for small graphs. Simple to code.",
          ],
        ],
      },
      {
        title: "Minimum Spanning Tree",
        topics: [
          [
            "Prim's Algorithm",
            "Prim grows a tree by always adding the cheapest edge to a new node. It uses a heap. The result connects all nodes at the least cost. It is used in network design.",
          ],
          [
            "Kruskal's Algorithm",
            "Kruskal sorts all edges and adds the cheapest that does not make a loop. It uses union-find to spot loops. It also builds the cheapest connecting tree. Great for sparse graphs.",
          ],
        ],
      },
      {
        title: "Advanced",
        topics: [
          [
            "Topological Sort",
            "Topological sort orders tasks so each one comes after what it depends on. It works on graphs with no cycles. It is used for build order and course prerequisites. It is done with BFS or DFS.",
          ],
          [
            "Union-Find",
            "Union-Find groups items and quickly answers 'are these connected?'. It merges groups in almost constant time. It is used in Kruskal and for connectivity. Simple but powerful.",
          ],
          [
            "Strongly Connected Components",
            "In a directed graph, an SCC is a group where every node can reach every other. Tarjan and Kosaraju find them with DFS. They reveal cycles. They help simplify a graph.",
          ],
        ],
      },
    ],
  },
  {
    id: "greedy",
    num: 14,
    title: "Greedy Algorithms",
    codeId: "greedy",
    summary: "Always take the best choice right now — when that is safe.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Greedy Strategy",
            "Greedy means always take the best choice right now and never look back. It is simple and fast. But it is only correct when the local best leads to the global best. If not, use dynamic programming instead.",
          ],
        ],
      },
      {
        title: "Problems",
        topics: [
          [
            "Activity Selection",
            "Pick the most activities that do not overlap. The trick is to always choose the one that finishes earliest. This leaves the most room for others. It is the classic greedy example.",
          ],
          [
            "Fractional Knapsack",
            "Fill a bag for the most value, and you can take parts of items. Take the best value-per-weight first. Splitting the last item fills the bag exactly. Greedy works here because fractions are allowed.",
          ],
          [
            "Job Sequencing",
            "Each job has a deadline and a profit, and takes one time unit. Do the most profitable jobs first, placed as late as possible before their deadline. This gives the most profit. Greedy plus a scheduling trick.",
          ],
        ],
      },
    ],
  },
  {
    id: "dp",
    num: 15,
    title: "Dynamic Programming",
    codeId: "dp",
    summary: "Solve a problem once, save the answer, and reuse it.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Memoization",
            "Memoization is recursion that remembers answers it already found. So it never solves the same thing twice. It turns slow repeated work into fast work. It is easy to add to existing recursion.",
          ],
          [
            "Tabulation",
            "Tabulation fills a table from the smallest cases up to the answer, with no recursion. It avoids stack problems and makes saving space easy. The hard part is deciding what the table means. It is bottom-up thinking.",
          ],
        ],
      },
      {
        title: "1-D DP",
        topics: [
          [
            "Fibonacci",
            "With DP, each Fibonacci number is computed once and stored. This makes it fast, O(n). It is the simplest DP example. It shows why we save answers.",
          ],
          [
            "Climbing Stairs",
            "Count the ways to climb n stairs taking 1 or 2 steps. Ways(n) = ways(n-1) plus ways(n-2). It is the same as Fibonacci. Learn to find the rule by looking at the last step.",
          ],
          [
            "House Robber",
            "You cannot rob two houses next to each other. Best so far = max of (skip this one) and (rob this one plus best two back). It is O(n). A foundation 1-D DP.",
          ],
        ],
      },
      {
        title: "2-D DP",
        topics: [
          [
            "Knapsack",
            "Pick items for the most value under a weight limit, each item taken or not. The table tracks the best value for each item count and weight. For each item, take the better of skip or take. The base of many subset problems.",
          ],
          [
            "LCS",
            "Longest common subsequence finds the longest order of letters shared by two strings. On a match, extend the diagonal; else take the best of dropping one letter. It is used in diff tools and DNA. A classic 2-D DP.",
          ],
          [
            "Edit Distance",
            "Edit distance is the fewest changes to turn one word into another. It allows insert, delete, and replace. The table picks the cheapest option per cell. It powers spell-check and autocorrect.",
          ],
        ],
      },
      {
        title: "Advanced DP",
        topics: [
          [
            "Matrix Chain Multiplication",
            "Find the cheapest order to multiply a chain of matrices. The order changes the cost a lot. Try every split point and keep the best. This is interval DP.",
          ],
          [
            "DP on Trees",
            "Solve a problem at each node using its children's answers. It is usually done bottom-up. Example: rob houses arranged as a tree. It extends DP to tree shapes.",
          ],
          [
            "Bitmask DP",
            "Use the bits of a number to remember which items are used. Each bit that is on means that item is chosen. It is used for small sets, like the traveling salesman. It works only for small n.",
          ],
        ],
      },
    ],
  },
  {
    id: "bits",
    num: 16,
    title: "Bit Manipulation",
    codeId: "bits",
    summary: "Play with the 0s and 1s directly for speed and tricks.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "AND (&)",
            "AND gives 1 only where both bits are 1. Use it to check a bit or keep certain bits. x AND 1 tells if a number is odd. It is a masking tool.",
          ],
          [
            "OR (|)",
            "OR gives 1 where either bit is 1. Use it to turn a bit on. It is good for combining flags. It never turns a 1 into a 0.",
          ],
          [
            "XOR (^)",
            "XOR gives 1 where the bits differ. The magic is that x XOR x is 0, so pairs cancel out. Great for finding a lone number or swapping without a temp. The trickiest and most useful bit op.",
          ],
          [
            "NOT (~)",
            "NOT flips every bit, 0 to 1 and 1 to 0. With AND it can clear a bit. It is mostly used together with the other operators. Simple but handy.",
          ],
        ],
      },
      {
        title: "Problems",
        topics: [
          [
            "Power of Two",
            "A number is a power of two if it has exactly one bit that is 1. Check with x greater than 0 and (x AND (x-1)) equal to 0. Subtracting 1 flips that lone bit. A quick interview question.",
          ],
          [
            "Set Bits",
            "Counting the 1-bits tells how many bits are on. The trick x AND-equals x-1 removes the lowest 1-bit each loop. Count the loops. It is used in Hamming distance.",
          ],
          [
            "Single Number",
            "In a list where all appear twice except one, XOR everything together. The pairs cancel and the lone number remains. It is O(n) and uses no extra memory. The star use of XOR.",
          ],
        ],
      },
      {
        title: "Advanced",
        topics: [
          [
            "Bitmasking",
            "Bitmasking stores a small set as the bits of a number. Bit i being on means item i is in the set. You can combine sets with AND and OR fast. It is used in advanced DP like the traveling salesman.",
          ],
        ],
      },
    ],
  },
  {
    id: "sorting",
    num: 17,
    title: "Sorting Algorithms",
    codeId: "sorting",
    summary: "Different ways to put data in order — fast and slow.",
    classes: [
      {
        title: "Basic Sorting",
        topics: [
          [
            "Bubble Sort",
            "Bubble sort swaps neighbors that are out of order, again and again. The biggest item bubbles to the end each pass. It is slow, O(n squared). It is mostly used to learn the idea.",
          ],
          [
            "Selection Sort",
            "Selection sort finds the smallest each round and puts it in front. It is O(n squared). It makes very few swaps. Mainly for learning.",
          ],
          [
            "Insertion Sort",
            "Insertion sort places each item into its spot among the already-sorted part. It is fast on nearly-sorted data. It is used inside bigger sorts for small chunks. Simple and stable.",
          ],
        ],
      },
      {
        title: "Efficient Sorting",
        topics: [
          [
            "Merge Sort",
            "Merge sort splits in half, sorts each half, and merges them. It is always O(n log n) and stable. It needs extra space to merge. Great for linked lists and huge files.",
          ],
          [
            "Quick Sort",
            "Quick sort picks a pivot, puts smaller items left and bigger right, then repeats. It is usually the fastest, O(n log n) on average. A bad pivot can make it O(n squared), which a random pivot fixes. It is the common library sort.",
          ],
          [
            "Heap Sort",
            "Heap sort builds a heap and removes the top repeatedly. It is in place, O(n log n), with no bad cases. It is not stable. It reuses the heap as a sorter.",
          ],
        ],
      },
      {
        title: "Special Sorting",
        topics: [
          [
            "Counting Sort",
            "Counting sort counts how many of each value, then rebuilds them in order. It is O(n plus k) and never compares items. It works only for a small range of values. It is used inside radix sort.",
          ],
          [
            "Radix Sort",
            "Radix sort sorts numbers digit by digit using a stable sort. It can beat O(n log n) for fixed-size numbers. It is good for IDs and dates. No comparisons needed.",
          ],
          [
            "Bucket Sort",
            "Bucket sort spreads items into buckets, sorts each, and joins them. It is about O(n) for evenly spread data. It is good for decimals in a range. It is distribution-based.",
          ],
        ],
      },
    ],
  },
  {
    id: "searching",
    num: 18,
    title: "Searching Algorithms",
    codeId: "binarysearch",
    summary: "Finding an item, or even the answer itself, quickly.",
    classes: [
      {
        title: "Basics",
        topics: [
          [
            "Linear Search",
            "Linear search checks each item until it finds the target. It is O(n). It works on unsorted data. The simplest search.",
          ],
          [
            "Binary Search",
            "Binary search needs sorted data. It checks the middle and throws away the wrong half each time. This is fast, O(log n). Watch the bounds, because off-by-one is the common bug.",
          ],
        ],
      },
      {
        title: "Advanced",
        topics: [
          [
            "Binary Search on Answer",
            "Sometimes the answer is a number, and if one value works, bigger ones work too. Then you can binary search the answer itself. You test a guess and narrow the range. It is used in minimum-capacity problems.",
          ],
          [
            "Lower Bound",
            "Lower bound is the first spot where a value is greater than or equal to the target. It is the leftmost place the target could go. It is found by a binary-search variant. It helps count items below a value.",
          ],
          [
            "Upper Bound",
            "Upper bound is the first spot strictly greater than the target. Upper minus lower counts how many times a value appears. Both run in O(log n). Many languages provide them ready-made.",
          ],
        ],
      },
    ],
  },
  {
    id: "advanced",
    num: 19,
    title: "Advanced Topics",
    summary: "Special structures for fast range queries and hard problems.",
    classes: [
      {
        title: "Segment Tree",
        topics: [
          [
            "Segment Tree",
            "A segment tree stores range answers like sum, min, or max in a tree. It does range queries and updates in O(log n). Use it when the array keeps changing. A favorite in contests.",
          ],
        ],
      },
      {
        title: "Fenwick Tree (BIT)",
        topics: [
          [
            "Fenwick Tree (BIT)",
            "A Fenwick tree gives running sums with updates in O(log n). It is smaller and simpler than a segment tree. It uses the lowest-set-bit trick. Great for counting problems.",
          ],
        ],
      },
      {
        title: "Sparse Table",
        topics: [
          [
            "Sparse Table",
            "A sparse table precomputes answers for power-of-two ranges. After that, min, max, or gcd queries are O(1). But the data must not change. Fastest for repeated range-min on fixed data.",
          ],
        ],
      },
      {
        title: "Disjoint Set Union (DSU)",
        topics: [
          [
            "Disjoint Set Union (DSU)",
            "DSU, also called union-find, groups items and merges them fast, near O(1). It answers 'are these connected?'. It is used in Kruskal and cycle detection. Simple and powerful.",
          ],
        ],
      },
      {
        title: "Mo's Algorithm",
        topics: [
          [
            "Mo's Algorithm",
            "Mo's answers many range queries offline by ordering them cleverly and moving two pointers. It is about O((n plus q) times root n). Use it when no easy structure exists. Sorting queries into blocks is the trick.",
          ],
        ],
      },
      {
        title: "Heavy-Light Decomposition",
        topics: [
          [
            "Heavy-Light Decomposition",
            "This splits a tree into chains so path queries become array queries. Then a segment tree answers them in O(log squared n). It turns hard tree paths into easy ranges. An advanced technique.",
          ],
        ],
      },
    ],
  },
  {
    id: "cp",
    num: 20,
    title: "Competitive Programming Topics",
    summary: "Math and number theory that show up in contests.",
    classes: [
      {
        title: "Mathematics",
        topics: [
          [
            "GCD",
            "GCD is the biggest number that divides both numbers. Euclid's trick is gcd(a, b) = gcd(b, a mod b). It is fast, about O(log). It is the base for fractions and LCM.",
          ],
          [
            "LCM",
            "LCM is the smallest number that both divide into. It is a times b divided by gcd(a, b). Divide first to avoid overflow. It is used for aligning repeating cycles.",
          ],
          [
            "Modular Arithmetic",
            "Modular math uses remainders and wraps around like a clock. It keeps huge numbers small by taking mod m. It is used in hashing and big factorials. Often the modulus is a prime like 1e9 plus 7.",
          ],
        ],
      },
      {
        title: "Number Theory",
        topics: [
          [
            "Sieve of Eratosthenes",
            "The sieve finds all primes up to n by crossing out multiples. It is fast, O(n log log n). It precomputes primes for many uses. Much faster than testing each number alone.",
          ],
          [
            "Prime Factorization",
            "Prime factorization breaks a number into its prime factors. Trial-divide up to its square root. With a sieve it is even faster. It is the base for counting divisors.",
          ],
        ],
      },
      {
        title: "Combinatorics & Probability",
        topics: [
          [
            "Combinatorics",
            "Combinatorics counts arrangements without listing them all. Permutations care about order, combinations do not. The formula nCr is n factorial over r factorial times (n-r) factorial. It is used for counting paths and outcomes.",
          ],
          [
            "Probability",
            "Probability measures how likely something is, from 0 to 1. Expected value is the average outcome over many tries. It is used to justify random algorithms. A useful contest tool.",
          ],
        ],
      },
    ],
  },
];

export const learningOrder = [
  "Programming Basics",
  "Time Complexity",
  "Arrays",
  "Strings",
  "Recursion",
  "Linked List",
  "Stack",
  "Queue",
  "Hashing",
  "Binary Search",
  "Sorting",
  "Trees",
  "Heap",
  "Trie",
  "Graphs",
  "Greedy",
  "Dynamic Programming",
  "Bit Manipulation",
  "Segment Tree / DSU",
  "Competitive Programming",
];

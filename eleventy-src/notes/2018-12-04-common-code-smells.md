---
title: Common Code Smells - Chapter 17 - Clean Code, Robert Martin
---

*This is a personal wiki notes that I use for own reference.* 

A list of common code smells to look out for. The information below are from Clean Code by Robert C. Martin.

- [Environment](#environment)
- [Functions](#functions)
- [General](#general)
  - [G5: Duplication](#g5-duplication)
  - [G6: Code at Wrong Level of Abstraction](#g6-code-at-wrong-level-of-abstraction)
  - [G7: Base Classes Depending on Their Derivatives](#g7-base-classes-depending-on-their-derivatives)
  - [G8: Too Much Information](#g8-too-much-information)
  - [G9: Dead Code](#g9-dead-code)
  - [G10: Vertical Separation](#g10-vertical-separation)
  - [G11: Inconsistency](#g11-inconsistency)

# Environment

- E1: Build Requires More Than One Step. 
- E2: Tests Require More Than One Step. 

# Functions 

- F1: Too Many Arguments
- F2: Output Arguments
- F3: Flag Arguments
- F4: Dead Function

# General 

## G5: Duplication

> Still more subtle are the modules that have similar algorithms, but that don’t share similar lines of code. This is still duplication and should be addressed by using the TEMPLATE METHOD or STRATEGY pattern.

## G6: Code at Wrong Level of Abstraction

## G7: Base Classes Depending on Their Derivatives

## G8: Too Much Information

## G9: Dead Code

> Dead code is code that isn’t executed. You find it in the body of an if statement that checks for a condition that can’t happen. You find it in the catch block of a try that never throws. You find it in little utility methods that are never called or switch/case conditions that never occur.

## G10: Vertical Separation

> Variables and function should be defined close to where they are used. Local variables should be declared just above their first usage and should have a small vertical scope. We don’t want local variables declared hundreds of lines distant from their usages.
> 
> Private functions should be defined just below their first usage. Private functions belong to the scope of the whole class, but we’d still like to limit the vertical distance between the invocations and definitions. Finding a private function should just be a matter of scanning downward from the first usage.

## G11: Inconsistency

> f you do something a certain way, do all similar things in the same way. This goes back to the **principle of least surprise**. Be careful with the conventions you choose, and once chosen, be careful to continue to follow them.


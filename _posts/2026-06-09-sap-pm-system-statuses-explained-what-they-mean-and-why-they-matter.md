---
title: "SAP PM System Statuses Explained: What They Mean and Why They Matter"
date: 2026-06-10
category: SAP PM & Operations
excerpt: If you have ever opened a work order in SAP PM and seen a string of
  codes like CNF, TECO, GMPS, and MACM, you are not alone
readTime: 5 min read
coverImage: /images/uploads/screenshot-2026-05-30-145410.png
---
If you have ever opened a work order in SAP PM and seen a string of codes like CNF, TECO, GMPS, and MACM, you are not alone. Most planners and maintenance supervisors encounter these statuses daily but never get a clear explanation of what each one actually means or why the system sets them. This guide breaks down the key SAP PM system statuses in plain language, covering the difference between system and user statuses, how they are triggered, and what each code tells you about the state of a work order.

**If You Cannot Read SAP PM Statuses, You Are Missing the Real Story Behind Your Work Orders**

Working in SAP PM means learning to read the system's language. Every status code on a work order is a signal, and once you understand what each one means, you stop second-guessing and start making faster, more confident decisions on the floor and in the office.

SAP PM statuses are not decorative codes sitting in the corner of your screen. They are the system's way of narrating the full life of a work order, from the moment it is created to the moment costs are finally settled. If you can read them correctly, you can understand the condition of any work order at a glance, without opening multiple screens.

**First, Understand the Two Types of Statuses**

Before breaking down individual codes, there is one foundational rule you need to know.

SAP statuses fall into two completely different categories: System Statuses and User Statuses.

**System Statuses** are delivered out of the box by SAP. They update automatically when specific business transactions are executed. You do not manually type them. SAP assigns them based on what you do in the system. Examples include CRTD, REL, CNF, TECO, and CLSD. These appear consistently across SAP environments because SAP controls the logic behind them.

**User Statuses** are company-specific. They are configured during implementation to reflect internal business workflows and approval processes. Examples include ORAP (Order Approved), OMWC (Order Main Work Completed), and WAIT (Waiting for Parts). Their meanings vary from one organisation to another because the business defines them, not SAP.

The simple rule: System Status means SAP controls it. User Status means the business defines it.

**Are Statuses Manually Assigned?**

Not always. Most standard system statuses are triggered automatically by your actions in the system.

When you create a work order, SAP assigns CRTD. When you release it, REL appears. When a technician confirms labor hours, CNF is set. When materials are issued via goods movement, GMPS is posted. When the physical work is declared complete, TECO is triggered.

The planner does not manually type any of these. SAP updates them automatically based on system activity.

User statuses, however, can be manually assigned, workflow-driven, or automatically triggered, depending on how the system has been configured in your organisation.

**Statuses Don't Only Apply to Work Orders**

Both Notifications and Work Orders carry statuses, but they track entirely different things.

**Notification statuses** track the problem. A notification identifies that something is wrong, for example, "Pump P-101 is leaking." Its statuses (OSNO, NOPR, NOCO) tell you where that reported problem sits in the process.

**Work order statuses** track the solution. A work order executes the actual repair, for example, "Replace the seal on Pump P-101." Its statuses (CRTD, REL, CNF, TECO) tell you where the execution and financial process stands.

Understanding this distinction prevents a lot of confusion when you are navigating both objects in the system.

**The Key SAP PM Status Codes Explained**

**CNF — Confirmed**

CNF is a System Status. It means work execution has been confirmed and the technician has officially recorded labor hours or progress against the work order operations.

Why it matters: it proves that maintenance activities have been successfully logged in the system. Without CNF, there is no record that the work actually happened from SAP's perspective.

Important note: CNF does not mean the entire order process is finished. It only confirms that execution data has been entered.

**PRC — Pre-Costed**

PRC is a configuration-dependent costing status. It means planned costs have been calculated and updated for the order's components and labor operations. It updates automatically when the order is saved after materials or labor operations are added, so no extra clicks are required from the planner.

Why it matters: it gives management financial visibility into expected maintenance costs before execution begins, and it allows planners to later compare planned costs against actual expenditures.

**SETC — Settlement Rule Created**

SETC is a System Status. It means a settlement rule has been successfully assigned to the work order. Think of it as SAP confirming it has a destination for the costs before the journey ends.

Why it matters: SAP now knows exactly which cost center, asset, or internal order should receive the maintenance costs at settlement.

What goes wrong without it: settlement errors during month-end closing can prevent cost allocation entirely, leaving costs stuck on the order with nowhere to go.

**TECO — Technically Completed**

TECO is a System Status. It means the physical maintenance work is finished and no further execution or material consumption is expected.

Why it matters: it separates physical execution from financial closure. When TECO is set, core fields become locked, further changes are restricted, and the order is prepared for final settlement.

Critical distinction: TECO is not the same as CLSD (Closed). An order can be physically complete but still open financially. TECO closes the execution story. CLSD closes the financial one. Confusing the two is one of the most common mistakes in SAP PM month-end processes.

**GMPS — Goods Movement Posted**

GMPS is a System Status. It means materials or spare parts have been issued or received against the work order, typically through a goods issue posting in MIGO (movement type 261).

Why it matters: it confirms that inventory has physically moved from stock to the maintenance activity, and that material costs have been posted to the order.

**MACM — Material Availability Confirmed**

MACM is a system or configuration-dependent status. It means the required materials have been checked and are either available or reserved for execution.

Important distinction: MACM means availability or reservation, not actual issuance. Once the materials are physically issued, the status transitions to GMPS.

Understanding the difference between MACM and GMPS is important for planners tracking material readiness versus actual consumption. One tells you the parts are ready. The other tells you they have already left the warehouse.

**ORAP — Order Approved**

ORAP is a User Status. It means the work order has passed internal approval gates, confirming that the maintenance work complies with safety, budget, and governance requirements before execution begins.

Since this is a custom configuration, it may not exist in all SAP environments.

**OMWC — Order Main Work Completed**

OMWC is also a User Status. It means the primary maintenance work is completed, though minor administrative tasks may still remain.

Why it matters: it signals operational completion before final technical or financial closure. Like ORAP, this status is organisation-specific and depends entirely on system configuration.

**Putting It All Together**

Here is a quick-reference summary of the work order lifecycle:

MACM → Materials available or reserved. GMPS → Materials issued and consumed. CNF → Work confirmed. TECO → Work technically completed. SETC → Order ready for settlement. CLSD → Order financially closed.

Every status code is the system's way of describing exactly where a work order stands in its lifecycle. Once you understand what each one means, you stop guessing and start reading the story the system is already telling you.

If this breakdown helped you, share it with someone on your team who is still learning SAP PM. And if there are other status codes or SAP PM concepts you would like explained, drop them in the comments.

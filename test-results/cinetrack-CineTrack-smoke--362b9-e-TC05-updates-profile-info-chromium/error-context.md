# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cinetrack.spec.ts >> CineTrack smoke automation suite >> TC05: updates profile info
- Location: tests\cinetrack.spec.ts:51:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#header-login-btn') to be visible

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - generic [ref=f1e5]:
      - generic [ref=f1e6]:
        - button "CineTrack App Reviews & Profile Suite" [ref=f1e7]:
          - generic [ref=f1e11]:
            - generic [ref=f1e12]:
              - text: CineTrack
              - generic [ref=f1e13]: App
            - paragraph [ref=f1e14]: Reviews & Profile Suite
        - navigation [ref=f1e15]:
          - button "Dashboard" [ref=f1e16]
          - button "Movie Reviews" [ref=f1e22]
          - button "Write Review" [ref=f1e28]
          - button "Profile" [ref=f1e31]
          - button "Test Automation Hub" [ref=f1e35]
      - generic [ref=f1e38]:
        - button "Switch to dark mode" [ref=f1e39]
        - button "View notifications" [ref=f1e43]:
          - generic [ref=f1e47]: "1"
        - button "Alex Rivera Alex Rivera" [ref=f1e49]:
          - img "Alex Rivera" [ref=f1e50]
          - generic [ref=f1e51]: Alex Rivera
  - main [ref=f1e52]:
    - generic [ref=f1e53]:
      - generic [ref=f1e55]:
        - generic [ref=f1e56]:
          - generic [ref=f1e57]: Movie Reviews & Profile Hub
          - heading "Welcome back, Alex Rivera!" [level=1] [ref=f1e62]
          - paragraph [ref=f1e63]: Rate movies from 1 to 5 stars, update your user profile data in real-time, toggle dark mode, and verify all flows with automated test suites.
        - generic [ref=f1e64]:
          - button "Log Movie Review" [ref=f1e65]
          - button "View Profile" [ref=f1e68]
      - generic [ref=f1e71]:
        - generic [ref=f1e72]:
          - generic [ref=f1e73]: Total Reviews
          - generic [ref=f1e78]:
            - generic [ref=f1e79]: "4"
            - generic [ref=f1e80]: films logged
        - generic [ref=f1e81]:
          - generic [ref=f1e82]: 5-Star Masterpieces
          - generic [ref=f1e87]:
            - generic [ref=f1e88]: "2"
            - generic [ref=f1e89]: top ratings
        - generic [ref=f1e90]:
          - generic [ref=f1e91]: Theme Mode
          - generic [ref=f1e100]:
            - generic [ref=f1e101]: Light Mode Active
            - button "Toggle" [ref=f1e102]
        - generic [ref=f1e103]:
          - generic [ref=f1e104]: Push Dispatcher
          - button "Fire Test Push" [ref=f1e111]
      - generic [ref=f1e112]:
        - generic [ref=f1e113]:
          - generic [ref=f1e114]:
            - heading "Latest Movie Reviews" [level=2] [ref=f1e115]
            - paragraph [ref=f1e116]: Recent ratings and reviews submitted by users.
          - button "View All Reviews (4)" [ref=f1e117]
        - generic [ref=f1e120]:
          - generic [ref=f1e121]:
            - generic [ref=f1e122]:
              - generic [ref=f1e123]:
                - heading "Interstellar" [level=3] [ref=f1e124]
                - generic [ref=f1e125]: "5.0"
              - paragraph [ref=f1e129]: An absolute masterpiece of emotional storytelling coupled with breathtaking scientific concepts and Hans Zimmers iconic score. The docking sequence alone is worth the 5 stars.
            - generic [ref=f1e130]:
              - generic [ref=f1e131]: By Alex Rivera
              - generic [ref=f1e132]: "24"
          - generic [ref=f1e135]:
            - generic [ref=f1e136]:
              - generic [ref=f1e137]:
                - 'heading "Dune: Part Two" [level=3] [ref=f1e138]'
                - generic [ref=f1e139]: "5.0"
              - paragraph [ref=f1e143]: Stunning cinematography, heavy bass design, and incredible pacing for such an expansive epic. Denis Villeneuve delivered on all fronts.
            - generic [ref=f1e144]:
              - generic [ref=f1e145]: By Alex Rivera
              - generic [ref=f1e146]: "19"
          - generic [ref=f1e149]:
            - generic [ref=f1e150]:
              - generic [ref=f1e151]:
                - heading "Inception" [level=3] [ref=f1e152]
                - generic [ref=f1e153]: "4.0"
              - paragraph [ref=f1e157]: Clever premise with brilliant execution. Pacing holds up remarkably well even on multiple rewatches.
            - generic [ref=f1e158]:
              - generic [ref=f1e159]: By Marcus Vance
              - generic [ref=f1e160]: "12"
  - contentinfo [ref=f1e163]:
    - generic [ref=f1e164]:
      - generic [ref=f1e165]:
        - generic [ref=f1e166]: CineTrack
        - generic [ref=f1e167]: •
        - generic [ref=f1e168]: Movie Reviews, Profile Dashboard & Automated Testing Suite
      - generic [ref=f1e169]:
        - button "Test Automation Locators" [ref=f1e170]
        - generic [ref=f1e171]: •
        - button "Back to Top" [ref=f1e172]
```

# Test source

```ts
  1 | 
    |                                             ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
```
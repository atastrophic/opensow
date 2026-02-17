## 1. Gartenmeister Orientation

- [x] 1.1 Update `gartenmeister.txt` orientation section (lines 125-131) to call `status` then immediately use `question` tool with state-based options (no gardens / no season / no crops / has crops)

## 2. Gartenmeister Ambiguous Intent

- [x] 2.1 Verify `gartenmeister.txt` ambiguous intent routing (line 143) already uses `question` tool — no change needed, just confirm

## 3. Direct Planting Loop Exit

- [x] 3.1 Update `direct-planting.txt` plant collection loop (lines 36-40) to use `question` tool with "Add another plant" / "I'm done" after each plant is added

## 4. Garden Setup Bed Attributes

- [x] 4.1 Update `garden-setup.txt` bed attribute collection (line 29) to use `question` tool for light exposure (Full sun / Partial sun / Full shade) with `custom: false`
- [x] 4.2 Update `garden-setup.txt` bed attribute collection (line 29) to use `question` tool for watering method (Drip / Sprinkler / Hand watering / None) with `custom: false`

## 5. Garden Setup Frost Confirmation

- [x] 5.1 Update `garden-setup.txt` frost date guideline (line 41) to explicitly reference the `question` tool for consistency with step 1

## 6. Validation

- [x] 6.1 Run tests to verify no regressions
- [x] 6.2 Build and install locally

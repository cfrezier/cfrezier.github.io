# reveal-gamepad-controller-plugin

A Reveal.js plugin allowing to control slides with gamepad. Allowing custom mappings

## How to

### Install
````shell
npm install reveal-gamepad-controller-plugin --save
````

### Include in your reveal slides

You can use this module directly using this code, but these are my own mapping needs. See belw to create your own mappings, or you can contribute and add it directly to the module
````js
<script type="module">
    import RevealGamepadController from "./node_modules/reveal-gamepad-controller-plugin/dist/index.js";
    
    Reveal.initialize({
        hash: true,

        // Learn about plugins: https://revealjs.com/plugins/
        plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealGamepadController(Reveal)],
    });
</script>
````

### Configuration
You can customize the duration between 2 loops of gamepad action detection, using `loopTime` option, and the mapping to use using `mapping` option.
````js
<script type="module">
    import RevealGamepadController from "./node_modules/reveal-gamepad-controller-plugin/dist/index.js";
    
    const gamepadPlugin = RevealGamepadController(Reveal);
    
    Reveal.initialize({
        hash: true,

        gamepadController: {
            loopTime: 1000, // For 1s
            mapping: gamepadPlugin.MAPPINGS['SN30_8bitDo'] // using specific Mapping
        }

        // Learn about plugins: https://revealjs.com/plugins/
        plugins: [RevealMarkdown, RevealHighlight, RevealNotes, gamepadPlugin],
    });
</script>
````

### Custom Mapping

#### Giving custom mapping in options
You can define your own mapping by just giving an object as mapping:
````js
<script type="module">
    import RevealGamepadController from "./node_modules/reveal-gamepad-controller-plugin/dist/index.js";
    
    const gamepadPlugin = RevealGamepadController(Reveal);
    
    Reveal.initialize({
        hash: true,

        gamepadController: {
            loopTime: 1000, // For 1s
            mapping: {
                buttons: [
                    {name: 'A', idx: 0, action: REVEAL_ACTIONS.NEXT},
                    {name: 'B', idx: 1, action: REVEAL_ACTIONS.DOWN},
                    {name: 'X', idx: 3, action: REVEAL_ACTIONS.UP},
                    {name: 'Y', idx: 4, action: REVEAL_ACTIONS.PREV},
                    {name: 'L1', idx: 6, action: REVEAL_ACTIONS.PREV},
                    {name: 'L2', idx: 7, action: REVEAL_ACTIONS.NEXT},
                    {name: 'R1', idx: 8, action: REVEAL_ACTIONS.PREV},
                    {name: 'R2', idx: 9, action: REVEAL_ACTIONS.NEXT},
                    {name: 'Select', idx: 10, action: REVEAL_ACTIONS.OVERVIEW},
                    {name: 'Start', idx: 11, action: REVEAL_ACTIONS.PAUSE},
                    {name: 'Special', idx: 12, action: REVEAL_ACTIONS.NONE},
                    {name: 'L3', idx: 13, action: REVEAL_ACTIONS.NONE},
                    {name: 'R3', idx: 14, action: REVEAL_ACTIONS.NONE},
                ],
                cross: [
                    {
                        name: 'Cross', idx: 9, actions: [
                            {name: 'nothing', value: 3.3, action: REVEAL_ACTIONS.NONE},
                            {name: 'down', value: 0.1428, action: REVEAL_ACTIONS.DOWN},
                            {name: 'up', value: -1, action: REVEAL_ACTIONS.UP},
                            {name: 'left', value: 0.71, action: REVEAL_ACTIONS.PREV},
                            {name: 'right', value: -0.428, action: REVEAL_ACTIONS.NEXT}
                        ]
                    }
                ],
                analog: [
                  {
                    name: 'Left Analog',
                    xIdx: 1,
                    yIdx: 0,
                    deadZone: 0.01,
                    action: REVEAL_ACTIONS.MOVE_SPOTLIGHT({multiplier: 30})
                  },
                  {
                    name: 'Right Analog',
                    xIdx: 5,
                    yIdx: 2,
                    deadZone: 0.01,
                    action: REVEAL_ACTIONS.MOVE_SPOTLIGHT({multiplier: 30})
                  }
                ]
            }
        }

        // Learn about plugins: https://revealjs.com/plugins/
        plugins: [RevealMarkdown, RevealHighlight, RevealNotes, gamepadPlugin],
    });
</script>
````

#### Define your own mapping
You can define the complete mapping by loading this plugin and trying to press buttons. 
Check the console and you'll be able to identify which button is what idx etc.

- For `Button` :
  - names are here for logging purposes
  - idx is the index of the button to scan in the `gamepad.buttons`
  - action is the action that will be triggered on "keydown". It's a `() => void`.
- For `Cross` :
    - names are here for logging purposes
    - idx is the index of the axis to scan in the `gamepad.axes`
    - actions is an array of trigger options: at each loop, the cross emit the action which value is the closest to the axis value. They are `() => void`.
    - Don't forget to have an action doing nothing in rest position of your pad.
- For `Analog`:
  - names are here for logging purposes
  - xIdx and yIdx are the indexes of the axis to scan in the `gamepad.axes`
  - deadZone allows not to trigger if values are below a certain amount
  - action is a `(x: number, y: number) => void`.

Once done, please send me your mapping and precise pad model so that i can add it to the library for future users !

#### Actions
I defined several actions in `plugin.REVEAL_ACTIONS`. 
Their names are normally self-explanatory, but feel free to take a look at the code if needed.
These are just a simple `() => void` function or `(x: number, y: number) => void` function (for analog ones). 
You can easily define your own.
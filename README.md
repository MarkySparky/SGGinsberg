Welcome to the ginsberg chart demo

For this exercise, I wanted to something a little different from a line / bar / area chart.

I took inspiration from the github punchcard report, but added a colour dimension to represent mood.


I choose a warm purple/blue colour as the base after reading http://www.color-wheel-pro.com/color-meaning.html and http://www.infoplease.com/spot/colors1.html
Blue is the color of the sky and sea. It is often associated with depth and stability. It symbolizes trust, loyalty, wisdom, confidence, intelligence, faith, truth, and heaven.
Blue is considered beneficial to the mind and body. It slows human metabolism and produces a calming effect. Blue is strongly associated with tranquility and calmness. In heraldry, blue is used to symbolize piety and sincerity.

The colours are accessed within the app object as
app.bubbleColor.colors 

To change the colours range to pinks at runtime you could go to a chrome console and type
app.bubbleColors = ["#ffe2e2", "#fdf", "#fcf", "#faf", "#f8f", "#f7f", "#f5f", "#f4f", "#f3f", "#f1f", "#f0f"];

Then run init again
app.init();



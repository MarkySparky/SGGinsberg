#Welcome to the ginsberg chart demo

For this exercise, I wanted to build something a little different from a line / bar / area chart.

I took inspiration from the github punchcard report, but added a colour dimension to represent mood.

I choose a warm purple/blue colour as the base after reading http://www.color-wheel-pro.com/color-meaning.html and http://www.infoplease.com/spot/colors1.html

Blue is the color of the sky and sea. It is often associated with depth and stability. It symbolizes trust, loyalty, wisdom, confidence, intelligence, faith, truth, and heaven.

Blue is considered beneficial to the mind and body. It slows human metabolism and produces a calming effect. Blue is strongly associated with tranquility and calmness.

The colours are accessed within the app object as
**app.bubbleColor.colors**

>To change the colours range to pinks at runtime you can use the Chrome console

**app.bubbleColors = ["#ffe2e2", "#fdf", "#fcf", "#faf", "#f8f", "#f7f", "#f5f", "#f4f", "#f3f", "#f1f", "#f0f"];**

Then run init again

**app.init();**

I had some issues accessing the endpoints because of cors missing from the response headers and also a 406 due to the additional required request Accept header.
I couldnt both get the 406 error cleared AND use jsonp to work around the lack of a cors response from the rest endpoints, as jsonp is just an on-the-fly inserted script tag with no place for request headers.

I resolved to setting up a quick proxy in Python or PHP to fetch the data for the javascript client. If you are still reading this, I either ran out of time or didnt do it fo rsome good reason. (I really need a Costa coffee). Hope this is ok, and its fairly trivial to set up a proxy, I just dont have a suitable server handy and I gathered that you were probably (hopefully) focusing on the visuals and interpretation of the data.

So, I have downloaded the data locally and softcoded the location of the data, and I have also generated some additional mock data to fill a year with mood data and better showcase the chart. trust this is ok.


<p align="center">
  <a href="https://morfi.vercel.app/">
    <img src="https://i.imgur.com/cDNjn1M.png" alt="The Morfi logo" height="100">
  </a>
</p>

# The Morfi
A simple website that tries to imitate the behavior of a food franchise with restaurants all over the United States

It is a project only with the intention of learning and improving skills, the entire page is pure fiction and most of the resources used in it are taken from other pages (in the credits section I try to mention all the ones I remember)

<strong>Active deployments</strong>
* [Vercel](https://morfi.vercel.app/) (full)
* [000webhost](https://the-morfi.000webhostapp.com/) (only what is necessary to run)
* [Github](https://arguel.github.io/morfi/) (full)

## Table of contents

- [Tests](#tests)
- [Known issues](#known-issues)
- [Images](#images)
- [Credits](#credits)

### Tests
Several tests were done during development and most of them got positive ratings, except for the top-offers page which has a lot of content and a problem with js

#### Results in the different browsers:
(In the desktop version)
* <b>Google Chrome v89.0.4389.90<br></b>
(The page was developed in this browser, so everything works as it should)
* <b>Firefox v86.0<br></b>
(Seems to work fine, more tests are needed)
* <b>Opera v74.0.3911.218<br></b>
(Seems to work fine, more tests are needed)
* <b>Internet Explorer v20H2<br></b>
(Several css classes are broken, but the page can still be used)
* <b>Microsoft Edge v89.0.774.54<br></b>
(Seems to work fine, more tests are needed)

### Known issues

* The format of the images is not 100% supported by old browsers / old versions, that is why it may be that several images are not seen, an example is the case of the Safari browser, in old versions it does not show the images
* Several parts of the code are written initially when I was learning to use frameworks and libraries, or I was using only a specific set of technologies (for example only html and css), that is why several parts could be optimized (for example replacing the old parts with bootstrap)
* The code is not 100% semantically written
* In mobile design, images tend to look stretched
* There are still several texts to be written, now there are only placeholders
* Lacks javascript (only has bootstrap js)
* The pagination does not work correctly (it is not adaptable to several pages)
* Text generally tends to look much larger on mobile and this causes some problems.
* There are sections that are in the code but that are not implemented yet, an example can be the blog section, or the account section
* The original color palette was no longer respected once bootstrap was implemented
* Most of the images do not have a defined width and height
* When the classes were assigned to the elements, a general order was not respected either, that is why the classes are all mixed
* ~~Most files don't have comments that can help~~
* Many accessibility standards are missing
* ~~The css is not minified~~
* ~~Several bootstrap classes are not used, it could be fixed by selecting only what will be used in the main.scss~~
* The metatags are all the same
* Several pages and several buttons do not work or do not exist (for now)
* The location map does not work because billing needs to be enabled, you could also put a map with an iframe but it seems to me that the most professional option is doing it like this
* Most individual items do not have their own page, for example shop items
* Maybe there are functions implemented in some pages that do not work in others, for example links in the footer that work well in about us, but that in faq do not work directly <strong>(I am not saying that this happens, but yes, this can happen)</strong>, this occurs because I reuse the same code and sometimes I don't remember updating the rest of the pages
* The offers that are in home/top-offers do not exist on the page where they should be (shop/top-offers)
* Home/top-offers items are resized according to the size of the image (on mobile), causing small resizing
* The BEM methodology was used at the beginning but now it is discontinued and the classes do not usually follow a pattern
* The page suffers from content shift, which is easy to fix but takes time
* The full bootstrap js file is being used
* The fontawesome libraries are very heavy and are not used in their entirety (at least in its free version)
* The page looks bad in large fonts
* The images lack adaptability for the mobile version of the page, a srcset could be used but that would also increase the total weight of the server
* Libraries are being loaded in some pages that do not use them (for example fontawesome in the login and register pages)
* The page has problems with the cache
* Navigation menus overlap if you have one active
* The selected item of filters in the mobile version of shop is doubled when clicked or hovered with the mouse.

#### Unknown bugs?

I could not test that 100% of the page works well, although I did some tests, I cannot assure anything. If you find a bug and want to help me you can upload a pull request (in the rework branch) or you can open a [new issue](https://github.com/Arguel/morfi/issues/new)

### Images
Digital version
<p align="center">
    <img src="https://i.imgur.com/ntUXogN.png" alt="digital1">
    <img src="https://i.imgur.com/heFQlBe.png" alt="digital2">
</p>
Website preview
<p><img src="https://i.imgur.com/8HtUPWY.png" alt="The Morfi logo" height="200"></p>
Color palette (they are not all used)
<p align="center"><img src="https://i.imgur.com/hTmoHQk.png" alt="The Morfi logo"></p>

### Credits
(coming soon)

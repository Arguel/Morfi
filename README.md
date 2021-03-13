# Morfi
A simple food website

---

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
* Most files don't have comments that can help
* Many accessibility standards are missing
* The css is not minified
* Several bootstrap classes are not used, it could be fixed by selecting only what will be used in the main.scss
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

### Unknown bugs?

I could not test that 100% of the page works well, although I did some tests, I cannot assure anything. If you find a bug and want to help me you can upload a pull request or you can open a new issue

# Journal Anchor Links

A library module for [Foundry VTT](https://foundryvtt.com/) that provides Journals with long desired page anchor links, similar to how it is [supported in HTML](https://en.wikipedia.org/wiki/URI_fragment).

## Example

https://user-images.githubusercontent.com/9851733/128767150-79f967f7-39a3-453f-8dbb-60b910080418.mp4

## How-To

Implementing this library in your module/system is easy:

1. Add it as a dependency in your manifest file _(`module.json` or `system.json`)_.
    - > Alternatively you can download the files and use the `lib.js` in your module. Note you also need to use the CSS fix found in the `jal.css`.
2. The module initiates itself if added as a dependency, else you will need to make sure you declare `lib.js` under the `script` property of your manifest file (see [Foundry's description of a manifest if uncertain](https://foundryvtt.com/article/module-development/)).
3. When writing journal entries use the `Headings` in the TextEditor's Rich Editor. Heading **1** through **6** are supported (or `<h1>..<h6>` if you prefer).
4. To begin linking, you write the link syntax like normal (`@JournalEntry[My Journal Entry | SomeId123]`), but you add a hash `#` after the **title/id** and then the heading you want to link to.
5. Like so: `@JournalEntry[My Cool Journal#Secrets]`.
6. If done right, the resulting link should look like this: `:icon:My Cool Journal: Secrets`.

### Scene Notes

That's right! This library supports anchor links in scene notes as well now. Simply drag the journal entry onto the canvas and give the `text` entry in the resulting pin a name corresponding to the heading you want.

> Et Voilà!

## License

See `LICENSE.txt`

## Author

[@aMediocreDad](https://github.com/aMediocreDad)

> _**If you like what I do, consider keeping me awake at night!**_

<p><a href="https://ko-fi.com/I3I64DHYX" target="_blank"><img width=30% src="https://ko-fi.com/img/githubbutton_sm.svg" /></a></p>

/* ------------------------------------------------------------- */
/*   © Copyright 2022, aMediocreDad                              */
/*                                                               */
/*   Distributed in accordance with Foundry Gaming LLC.          */
/*   LIMITED LICENSE AGREEMENT FOR MODULE DEVELOPMENT            */
/*                                                               */
/*   You may use this software free of charge as long as it      */
/*   adheres to the above limited license agreement. For more    */
/*   information visit: https://foundryvtt.com/article/license/  */
/*                                                               */
/* ------------------------------------------------------------- */

Hooks.on("dropCanvasData", (canvas, data) => {
	if (!(data.type === "JournalEntryPage" && data.anchor)) return;
	const { anchor } = data;

	Hooks.once("renderNoteConfig", (_, html, __) => {
		html.find("input[name='text']").val(anchor.name);
	});

	// Create note is called when closing the note creation dialog
	Hooks.once("createNote", () => {
		// The note is then redrawn, so we can hook into that process
		Hooks.once("drawNote", (note) => {
			// And then update the scene with the correct flag
			note.scene.updateEmbeddedDocuments("Note", [
				{
					_id: note.id,
					flags: { anchor },
				},
			]);
		});
	});
});

// Why doesn't this just exist in core foundry?
Hooks.on("activateNote", (note, options) => {
	options.anchor = note.document.flags.anchor?.slug;
});


function getOptions(page,current) {
	let options = "<option></option>";
	if (page?.type === "text") {
		for (const section of Object.values(page.toc)) {
			options += `<option value="${section.slug}"${section.slug === current ? " selected" : ""}>${section.text}</option>`;
		}
	}
	return options;
}

Hooks.on("renderNoteConfig", async (app,html,data) => {
	let select = $(`<div class='form-group'><label>Page Section:</label><div class='form-fields'><select name="flags.anchor.slug">${getOptions(data.document.page, data.document.flags.anchor?.slug)}</select></div></div>`)
	const pageid = html.find("select[name='pageId']");
	pageid.parent().parent().after(select);

	// on change of page or journal entry
	function _updateSectionList() {
		const newjournalid = app.form.elements.entryId?.value;
		const newpageid    = app.form.elements.pageId?.value;
		const journal = game.journal.get(newjournalid);
		const newpage = journal?.pages.get(newpageid);
		console.log(`selected page changed to ${newpageid}`);

		console.log("new options =", getOptions(newpage, data.document.flags.anchor?.slug));
		app.form.elements["flags.anchor.slug"].innerHTML = getOptions(newpage, data.document.flags.anchor?.slug);
		console.log("new innerHtml", app.form.elements["flags.anchor.slug"].innerHTML);
	}
	html.find("select[name='entryId']").change(_updateSectionList);
	pageid.change(_updateSectionList);

    // Force a recalculation of the height (for the additional field)
	if (!app._minimized) {
		let pos = app.position;
		pos.height = 'auto'
		app.setPosition(pos);
	}
})
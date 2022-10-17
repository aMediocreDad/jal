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

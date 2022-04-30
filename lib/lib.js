/* ------------------------------------------------------------- */
/*   This is a library module that modifies                      */
/*   some of Foundry VTTs core functions                         */
/*                                                               */
/*   © Copyright 2022, Foundry Gaming, LLC.                      */
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

Hooks.once("init", () => {
	Jal();
});

/**
 * @author Foundry Gaming LLC. & aMediocreDad // Overrides are commented in the lib module
 * @license Copyright See preamble
 * @description This is a module that overrides foundry methods in order to provide anchor linking functionality
 */
const Jal = () => {
	TextEditor._createContentLink = function (_match, type, target, name) {
		const data = {
			cls: ["entity-link", "content-link"],
			icon: null,
			dataset: {},
			name: name,
		};
		let broken = false;

		/**
		 * @override Define anchor by splitting the target string
		 */
		let anchor;
		[target, anchor] = target.split("#");
		/* End */

		// Get a matched World document
		if (CONST.DOCUMENT_TYPES.includes(type)) {
			// Get the linked Document
			const config = CONFIG[type];
			const collection = game.collections.get(type);
			const document = /^[a-zA-Z0-9]{16}$/.test(target)
				? collection.get(target)
				: collection.getName(target);
			if (!document) broken = true;

			// Update link data
			data.name = data.name || (broken ? target : document.name);
			data.icon = config.sidebarIcon;
			data.dataset = {
				type,
				entity: type,
				id: broken ? null : document.id,
			};
		}

		// Get a matched PlaylistSound
		else if (type === "PlaylistSound") {
			const [, playlistId, , soundId] = target.split(".");
			const playlist = game.playlists.get(playlistId);
			const sound = playlist?.sounds.get(soundId);
			if (!playlist || !sound) broken = true;

			data.name = data.name || (broken ? target : sound.name);
			data.icon = CONFIG.Playlist.sidebarIcon;
			data.dataset = { type, playlistId, soundId };
			const playing = Array.from(game.audio.playing.values()).find(
				(s) => s._sourceId === sound.uuid
			);
			if (playing) data.cls.push("playing");
		}

		// Get a matched Compendium document
		else if (type === "Compendium") {
			// Get the linked Document
			let [scope, packName, id] = target.split(".");
			const pack = game.packs.get(`${scope}.${packName}`);
			if (pack) {
				data.dataset = { pack: pack.collection };
				data.icon = CONFIG[pack.documentName].sidebarIcon;

				// If the pack is indexed, retrieve the data
				if (pack.index.size) {
					const index = pack.index.find(
						(i) => i._id === id || i.name === id
					);
					if (index) {
						if (!data.name) data.name = index.name;
						data.dataset.id = index._id;
					} else broken = true;
				}

				// Otherwise assume the link may be valid, since the pack has not been indexed yet
				if (!data.name) data.name = data.dataset.lookup = id;
			} else broken = true;
		}

		// Flag a link as broken
		if (broken) {
			data.icon = "fas fa-unlink";
			data.cls.push("broken");
		}

		/**
		 * Add anchor to dataset if anchor exists
		 */
		if (anchor && (type === "JournalEntry" || type === "Compendium")) {
			data.dataset.anchor = anchor;
			//Add type regardless for safety
			if (type) data.dataset.entity = type;
			// Change the name only if a custom name isn't provided
			if (!name) data.name = data.name + ": " + anchor;
		}
		/* End */

		// Construct the formed link
		const a = document.createElement("a");
		a.classList.add(...data.cls);
		a.draggable = true;
		for (let [k, v] of Object.entries(data.dataset)) {
			a.dataset[k] = v;
		}
		a.innerHTML = `<i class="${data.icon}"></i> ${data.name}`;
		return a;
	};

	/* -------------------------------------------- */

	TextEditor._onClickContentLink = async function (event) {
		event.preventDefault();
		const a = event.currentTarget;
		let document = null;
		let id = a.dataset.id;

		/**
		 * Declare anchor and entity added in _createContentLink
		 */
		const { anchor, entity } = a.dataset;
		/* End */

		// Target 1 - Compendium Link
		if (a.dataset.pack) {
			const pack = game.packs.get(a.dataset.pack);
			if (a.dataset.lookup) {
				if (!pack.index.length) await pack.getIndex();
				const entry = pack.index.find(
					(i) =>
						i._id === a.dataset.lookup ||
						i.name === a.dataset.lookup
				);
				if (entry) {
					a.dataset.id = id = entry._id;
					delete a.dataset.lookup;
				}
			}
			doc = id ? await pack.getDocument(id) : null;
		}

		// Target 2 - PlaylistSound Link
		else if (a.dataset.soundId) {
			const playlist = game.playlists.get(a.dataset.playlistId);
			doc = playlist?.sounds.get(a.dataset.soundId);
		}

		// Target 3 - World Document Link
		else {
			const collection = game.collections.get(a.dataset.type);
			doc = collection.get(id);
			if (!doc) return;
			if (doc.documentName === "Scene" && doc.journal) doc = doc.journal;
			if (!doc.testUserPermission(game.user, "LIMITED")) {
				return ui.notifications.warn(
					`You do not have permission to view this ${doc.documentName} sheet.`
				);
			}
		}
		if (!doc) return;

		// Action 1 - Execute an Action
		if (doc.documentName === "Macro") {
			if (!doc.testUserPermission(game.user, "LIMITED")) {
				return ui.notifications.warn(
					`You do not have permission to use this ${doc.documentName}.`
				);
			}
			return doc.execute();
		}

		// Action 2 - Play the sound
		else if (doc.documentName === "PlaylistSound")
			return TextEditor._onPlaySound(doc);

		/**
		 * @override Render sheet and hook onto rendering process to scroll to heading if found.
		 */
		if (anchor && (entity === "JournalEntry" || entity === "Compendium")) {
			doc.sheet.render(true);
			scrollOnRender(anchor);
		} else return doc.sheet.render(true);
		/* End */
	};

	/* -------------------------------------------- */

	/**
	 * @override Add scroll functionality to Map Pins too!
	 * @param {*} _event Unused by this method.
	 */
	Note.prototype._onClickLeft2 = function (_event) {
		if (this.entry) {
			this.entry.sheet.render(true);
			scrollOnRender(this.text);
		}
	};
	/* End */
};

/* -------------------------------------------- */

/**
 * Ensures scrolling to the correct heading.
 * @param {string} anchor String used to search headings.
 */
function scrollOnRender(anchor) {
	Hooks.once("renderDocumentSheet", (_app, html, _data) => {
		const content = html.find("div.editor-content"); // We don't want to grab the title of the JE.
		const header = content.children().filter(function () { return $(this).text().trim() === anchor })[0] ?? content.find(`#${anchor}`)[0] ?? content.find(`:header:contains("${anchor}")`)[0];
		if (header) {
			header.scrollIntoView({ behavior: "smooth" });
		} else console.warn(game.i18n.localize("JAL | ","WARNING.No_Anchor_Found"));;
	});
}

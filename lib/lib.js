/* ------------------------------------------------------------- */
/*   This is a library module that modifies                      */
/*   some of Foundry VTTs core functions                         */
/*                                                               */
/*   © Copyright 2021, Foundry Gaming, LLC.                      */
/*   © Copyright 2021, aMediocreDad                              */
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
			cls: ["entity-link"],
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

		if (CONST.ENTITY_TYPES.includes(type)) {
			const config = CONFIG[type];
			const collection = game.collections.get(type);
			const document = /^[a-zA-Z0-9]{16}$/.test(target)
				? collection.get(target)
				: collection.getName(target);
			if (!document) broken = true;

			data.name = data.name || (broken ? target : document.name);
			data.icon = config.sidebarIcon;
			data.dataset = {
				entity: type,
				id: broken ? null : document.id,
			};
		} else if (type === "Compendium") {
			let [scope, packName, id] = target.split(".");
			const pack = game.packs.get(`${scope}.${packName}`);
			if (pack) {
				data.dataset = { pack: pack.collection };
				data.icon = CONFIG[pack.metadata.entity].sidebarIcon;

				if (pack.index.size) {
					const index = pack.index.find(
						(i) => i._id === id || i.name === id
					);
					if (index) {
						if (!data.name) data.name = index.name;
						data.dataset.id = index._id;
					} else broken = true;
				}

				if (!data.name) data.name = data.dataset.lookup = id;
			} else broken = true;
		}

		if (broken) {
			data.icon = "fas fa-unlink";
			data.cls.push("broken");
		}

		/**
		 * Add anchor to dataset if anchor exists
		 */
		if (anchor && type === "JournalEntry") {
			data.dataset.anchor = anchor;
			//Add type regardless for safety
			if (type) data.dataset.entity = type;
			// Change the name only if a custom name isn't provided
			if (!name) data.name = data.name + ": " + anchor;
		}
		/* End */

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
			document = id ? await pack.getDocument(id) : null;
		} else {
			const collection = game.collections.get(a.dataset.entity);
			document = collection.get(id);
			if (document.documentName === "Scene" && document.journal)
				document = document.journal;
			if (!document.testUserPermission(game.user, "LIMITED")) {
				return ui.notifications.warn(
					`You do not have permission to view this ${document.documentName} sheet.`
				);
			}
		}
		if (!document) return;

		if (document.documentName === "Macro") {
			if (!document.testUserPermission(game.user, "LIMITED")) {
				return ui.notifications.warn(
					`You do not have permission to use this ${document.documentName}.`
				);
			}
			return document.execute();
		}

		/**
		 * @override Render sheet and hook onto rendering process to scroll to heading if found.
		 */
		if (anchor && entity === "JournalEntry") {
			document.sheet.render(true);
			scrollOnRender(anchor);
		} else return document.sheet.render(true);
		/* End */
	};

	/* -------------------------------------------- */

	/**
	 * @override Add scroll functionality to Map Pins too!
	 * @param {*} _event
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
		const header = content.find(`:header:contains("${anchor}")`)[0];
		if (header) {
			header.scrollIntoView({ behavior: "smooth" });
		} else console.warn(game.i18n.localize("WARNING.No_Anchor_Found"));
		return;
	});
}

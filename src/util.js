function escapeRegex(str) {
	return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

function isSnowflake(stuff) {
	return /^(\d{17,19})$/.test(stuff)    
}

function disambiguation(items, label, property = 'name') {
	const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
	return `Multiple ${label} found, please be more specific: ${itemList}`;
}

function paginate(items, page = 1, pageLength = 10) {
	const maxPage = Math.ceil(items.length / pageLength);
	if(page < 1) page = 1;
	if(page > maxPage) page = maxPage;
	const startIndex = (page - 1) * pageLength;
	return {
		items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
		page,
		maxPage,
		pageLength
	};
}

const permissions = {
	administrator: 'Administrator',
	viewAuditLog: 'View audit log',
	manageGuild: 'Manage server',
	manageRoles: 'Manage roles',
	manageChannels: 'Manage channels',
	kickMembers: 'Kick members',
  banMembers: 'Ban members',
	createInstantInvite: 'Create instant invite',
	changeNickname: 'Change nickname',
	manageNicknames: 'Manage nicknames',
	manageEmojis: 'Manage emojis',
	manageWebhooks: 'Manage webhooks',
	viewChannels: 'Read text channels and see voice channels',
	sendMessages: 'Send messages',
	sendTTSMessages: 'Send TTS messages',
	manageMessages: 'Manage messages',
	embedLinks: 'Embed links',
	attachFiles: 'Attach files',
	readMessageHistory: 'Read message history',
	mentionEveryone: 'Mention everyone',
	useExternalEmojis: 'Use external emojis',
	addReactions: 'Add reactions',
	voiceConnect: 'Connect',
	voiceSpeak: 'Speak',
	voiceMuteMembers: 'Mute members',
	voiceDeafenMembers: 'Deafen members',
	voiceMoveMembers: 'Move members',
	voiceUseVAD: 'Use voice activity'
};

function escapeMarkdown(
    text,
    {
      codeBlock = true,
      inlineCode = true,
      bold = true,
      italic = true,
      underline = true,
      strikethrough = true,
      spoiler = true,
      codeBlockContent = true,
      inlineCodeContent = true,
    } = {},
  ) {
    if (!codeBlockContent) {
      return text
        .split('```')
        .map((subString, index, array) => {
          if (index % 2 && index !== array.length - 1) return subString;
          return escapeMarkdown(subString, {
            inlineCode,
            bold,
            italic,
            underline,
            strikethrough,
            spoiler,
            inlineCodeContent,
          });
        })
        .join(codeBlock ? '\\`\\`\\`' : '```');
    }
    if (!inlineCodeContent) {
      return text
        .split(/(?<=^|[^`])`(?=[^`]|$)/g)
        .map((subString, index, array) => {
          if (index % 2 && index !== array.length - 1) return subString;
          return escapeMarkdown(subString, {
            codeBlock,
            bold,
            italic,
            underline,
            strikethrough,
            spoiler,
          });
        })
        .join(inlineCode ? '\\`' : '`');
    }
    if (inlineCode) text = escapeInlineCode(text);
    if (codeBlock) text = escapeCodeBlock(text);
    if (italic) text = escapeItalic(text);
    if (bold) text = escapeBold(text);
    if (underline) text = escapeUnderline(text);
    if (strikethrough) text = escapeStrikethrough(text);
    if (spoiler) text = escapeSpoiler(text);
    return text;
  }

  /**
   * Escapes code block markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
   function escapeCodeBlock(text) {
    return text.replace(/```/g, '\\`\\`\\`');
  }

  /**
   * Escapes inline code markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
   function escapeInlineCode(text) {
    return text.replace(/(?<=^|[^`])`(?=[^`]|$)/g, '\\`');
  }

  /**
   * Escapes italic markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
   function escapeItalic(text) {
    let i = 0;
    text = text.replace(/(?<=^|[^*])\*([^*]|\*\*|$)/g, (_, match) => {
      if (match === '**') return ++i % 2 ? `\\*${match}` : `${match}\\*`;
      return `\\*${match}`;
    });
    i = 0;
    return text.replace(/(?<=^|[^_])_([^_]|__|$)/g, (_, match) => {
      if (match === '__') return ++i % 2 ? `\\_${match}` : `${match}\\_`;
      return `\\_${match}`;
    });
  }

  /**
   * Escapes bold markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
   function escapeBold(text) {
    let i = 0;
    return text.replace(/\*\*(\*)?/g, (_, match) => {
      if (match) return ++i % 2 ? `${match}\\*\\*` : `\\*\\*${match}`;
      return '\\*\\*';
    });
  }

  /**
   * Escapes underline markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
   function escapeUnderline(text) {
    let i = 0;
    return text.replace(/__(_)?/g, (_, match) => {
      if (match) return ++i % 2 ? `${match}\\_\\_` : `\\_\\_${match}`;
      return '\\_\\_';
    });
  }

  /**
   * Escapes strikethrough markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
   function escapeStrikethrough(text) {
    return text.replace(/~~/g, '\\~\\~');
  }

  /**
   * Escapes spoiler markdown in a string.
   * @param {string} text Content to escape
   * @returns {string}
   */
   function escapeSpoiler(text) {
    return text.replace(/\|\|/g, '\\|\\|');
  }

   /**
   * Splits a string into multiple chunks at a designated character that do not exceed a specific length.
   * @param {StringResolvable} text Content to split
   * @param {SplitOptions} [options] Options controlling the behavior of the split
   * @returns {string[]}
   */
	function splitMessage(text, { maxLength = 2000, char = '\n', prepend = '', append = '' } = {}) {
		text = resolveString(text);
		if (text.length <= maxLength) return [text];
		const splitText = text.split(char);
		if (splitText.some(chunk => chunk.length > maxLength)) throw new RangeError('SPLIT_MAX_LEN');
		const messages = [];
		let msg = '';
		for (const chunk of splitText) {
		  if (msg && (msg + char + chunk + append).length > maxLength) {
			messages.push(msg + append);
			msg = prepend;
		  }
		  msg += (msg && msg !== prepend ? char : '') + chunk;
		}
		return messages.concat(msg).filter(m => m);
	  }

	    /**
   * Resolves a StringResolvable to a string.
   * @param {StringResolvable} data The string resolvable to resolve
   * @returns {string}
   */
  function resolveString(data) {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.join('\n');
    return String(data);
  }

module.exports = {
	escapeRegex,
	disambiguation,
	paginate,
	isSnowflake,
	permissions,
	escapeMarkdown,
	splitMessage,
	resolveString,
  resolveColor,
};

function resolveColor(color) {
  if (typeof color === 'string') {
    if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
    if (color === 'DEFAULT') return 0;
    color = Colors[color] || parseInt(color.replace('#', ''), 16);
  } else if (Array.isArray(color)) {
    color = (color[0] << 16) + (color[1] << 8) + color[2];
  }

  if (color < 0 || color > 0xffffff) throw new RangeError('COLOR_RANGE');
  else if (color && isNaN(color)) throw new TypeError('COLOR_CONVERT');

  return color;
}

const Colors = {
  DEFAULT: 0x000000,
  WHITE: 0xffffff,
  AQUA: 0x1abc9c,
  GREEN: 0x2ecc71,
  BLUE: 0x3498db,
  YELLOW: 0xffff00,
  PURPLE: 0x9b59b6,
  LUMINOUS_VIVID_PINK: 0xe91e63,
  GOLD: 0xf1c40f,
  ORANGE: 0xe67e22,
  RED: 0xe74c3c,
  GREY: 0x95a5a6,
  NAVY: 0x34495e,
  DARK_AQUA: 0x11806a,
  DARK_GREEN: 0x1f8b4c,
  DARK_BLUE: 0x206694,
  DARK_PURPLE: 0x71368a,
  DARK_VIVID_PINK: 0xad1457,
  DARK_GOLD: 0xc27c0e,
  DARK_ORANGE: 0xa84300,
  DARK_RED: 0x992d22,
  DARK_GREY: 0x979c9f,
  DARKER_GREY: 0x7f8c8d,
  LIGHT_GREY: 0xbcc0c0,
  DARK_NAVY: 0x2c3e50,
  BLURPLE: 0x7289da,
  GREYPLE: 0x99aab5,
  DARK_BUT_NOT_BLACK: 0x2c2f33,
  NOT_QUITE_BLACK: 0x23272a,
};
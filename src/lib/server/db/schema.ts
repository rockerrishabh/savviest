import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, integer, index } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	role: text('role'),
	banned: boolean('banned').default(false),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires'),
	twoFactorEnabled: boolean('two_factor_enabled').default(false)
});

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		impersonatedBy: text('impersonated_by')
	},
	(table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull()
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const twoFactor = pgTable(
	'two_factor',
	{
		id: text('id').primaryKey(),
		secret: text('secret').notNull(),
		backupCodes: text('backup_codes').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => [
		index('twoFactor_secret_idx').on(table.secret),
		index('twoFactor_userId_idx').on(table.userId)
	]
);

export const passkey = pgTable(
	'passkey',
	{
		id: text('id').primaryKey(),
		name: text('name'),
		publicKey: text('public_key').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		credentialID: text('credential_id').notNull(),
		counter: integer('counter').notNull(),
		deviceType: text('device_type').notNull(),
		backedUp: boolean('backed_up').notNull(),
		transports: text('transports'),
		createdAt: timestamp('created_at'),
		aaguid: text('aaguid')
	},
	(table) => [
		index('passkey_userId_idx').on(table.userId),
		index('passkey_credentialID_idx').on(table.credentialID)
	]
);

// ==================== BLOG TABLES ====================

export const post = pgTable(
	'post',
	{
		id: text('id').primaryKey(),
		title: text('title').notNull(),
		slug: text('slug').notNull().unique(),
		excerpt: text('excerpt'), // Short description for previews
		content: text('content').notNull(),
		coverImage: text('cover_image'),
		published: boolean('published').default(false).notNull(),
		publishedAt: timestamp('published_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		authorId: text('author_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => [
		index('post_authorId_idx').on(table.authorId),
		index('post_slug_idx').on(table.slug),
		index('post_published_idx').on(table.published)
	]
);

export const tag = pgTable('tag', {
	id: text('id').primaryKey(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const postTag = pgTable(
	'post_tag',
	{
		postId: text('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		tagId: text('tag_id')
			.notNull()
			.references(() => tag.id, { onDelete: 'cascade' })
	},
	(table) => [
		index('postTag_postId_idx').on(table.postId),
		index('postTag_tagId_idx').on(table.tagId)
	]
);

// Nested comments with parentId for threading
export const comment = pgTable(
	'comment',
	{
		id: text('id').primaryKey(),
		content: text('content').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		postId: text('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		authorId: text('author_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		parentId: text('parent_id') // For nested/threaded comments - null means top-level
	},
	(table) => [
		index('comment_postId_idx').on(table.postId),
		index('comment_authorId_idx').on(table.authorId),
		index('comment_parentId_idx').on(table.parentId)
	]
);

// Post likes
export const postLike = pgTable(
	'post_like',
	{
		id: text('id').primaryKey(),
		postId: text('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('postLike_postId_idx').on(table.postId),
		index('postLike_userId_idx').on(table.userId)
	]
);

// Comment likes
export const commentLike = pgTable(
	'comment_like',
	{
		id: text('id').primaryKey(),
		commentId: text('comment_id')
			.notNull()
			.references(() => comment.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('commentLike_commentId_idx').on(table.commentId),
		index('commentLike_userId_idx').on(table.userId)
	]
);

// Bookmarks/Saved posts
export const bookmark = pgTable(
	'bookmark',
	{
		id: text('id').primaryKey(),
		postId: text('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('bookmark_postId_idx').on(table.postId),
		index('bookmark_userId_idx').on(table.userId)
	]
);

// ==================== RELATIONS ====================

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	posts: many(post),
	comments: many(comment),
	postLikes: many(postLike),
	commentLikes: many(commentLike),
	bookmarks: many(bookmark),
	twoFactors: many(twoFactor),
	passkeys: many(passkey)
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
	user: one(user, {
		fields: [twoFactor.userId],
		references: [user.id]
	})
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
	user: one(user, {
		fields: [passkey.userId],
		references: [user.id]
	})
}));

export const postRelations = relations(post, ({ one, many }) => ({
	author: one(user, {
		fields: [post.authorId],
		references: [user.id]
	}),
	comments: many(comment),
	likes: many(postLike),
	bookmarks: many(bookmark),
	postTags: many(postTag)
}));

export const tagRelations = relations(tag, ({ many }) => ({
	postTags: many(postTag)
}));

export const postTagRelations = relations(postTag, ({ one }) => ({
	post: one(post, {
		fields: [postTag.postId],
		references: [post.id]
	}),
	tag: one(tag, {
		fields: [postTag.tagId],
		references: [tag.id]
	})
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
	post: one(post, {
		fields: [comment.postId],
		references: [post.id]
	}),
	author: one(user, {
		fields: [comment.authorId],
		references: [user.id]
	}),
	parent: one(comment, {
		fields: [comment.parentId],
		references: [comment.id],
		relationName: 'commentReplies'
	}),
	replies: many(comment, { relationName: 'commentReplies' }),
	likes: many(commentLike)
}));

export const postLikeRelations = relations(postLike, ({ one }) => ({
	post: one(post, {
		fields: [postLike.postId],
		references: [post.id]
	}),
	user: one(user, {
		fields: [postLike.userId],
		references: [user.id]
	})
}));

export const commentLikeRelations = relations(commentLike, ({ one }) => ({
	comment: one(comment, {
		fields: [commentLike.commentId],
		references: [comment.id]
	}),
	user: one(user, {
		fields: [commentLike.userId],
		references: [user.id]
	})
}));

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
	post: one(post, {
		fields: [bookmark.postId],
		references: [post.id]
	}),
	user: one(user, {
		fields: [bookmark.userId],
		references: [user.id]
	})
}));

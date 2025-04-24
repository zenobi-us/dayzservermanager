import { z } from "zod";

export const EPublishedFileQueryType = {
    RankedByVote: '0',
    RankedByPublicationDate: '1',
    AcceptedForGameRankedByAcceptanceDate: '2',
    RankedByTrend: '3',
    FavoritedByFriendsRankedByPublicationDate: '4',
    CreatedByFriendsRankedByPublicationDate: '5',
    RankedByNumTimesReported: '6',
    CreatedByFollowedUsersRankedByPublicationDate: '7',
    NotYetRated: '8',
    RankedByTotalUniqueSubscriptions: '9',
    RankedByTotalVotesAsc: '10',
    RankedByVotesUp: '11',
    RankedByTextSearch: '12',
    RankedByPlaytimeTrend: '13',
    RankedByTotalPlaytime: '14',
    RankedByAveragePlaytimeTrend: '15',
    RankedByLifetimeAveragePlaytime: '16',
    RankedByPlaytimeSessionsTrend: '17',
    RankedByLifetimePlaytimeSessions: '18',
    RankedByInappropriateContentRating: '19'
} as const;

type EPublishedFileQueryType = typeof EPublishedFileQueryType[keyof typeof EPublishedFileQueryType];

export const EPublishedFileQueryTypeSchema = z.enum([
    (EPublishedFileQueryType.RankedByVote),
    (EPublishedFileQueryType.RankedByPublicationDate),
    (EPublishedFileQueryType.AcceptedForGameRankedByAcceptanceDate),
    (EPublishedFileQueryType.RankedByTrend),
    (EPublishedFileQueryType.FavoritedByFriendsRankedByPublicationDate),
    (EPublishedFileQueryType.CreatedByFriendsRankedByPublicationDate),
    (EPublishedFileQueryType.RankedByNumTimesReported),
    (EPublishedFileQueryType.CreatedByFollowedUsersRankedByPublicationDate),
    (EPublishedFileQueryType.NotYetRated),
    (EPublishedFileQueryType.RankedByTotalUniqueSubscriptions),
    (EPublishedFileQueryType.RankedByTotalVotesAsc),
    (EPublishedFileQueryType.RankedByVotesUp),
    (EPublishedFileQueryType.RankedByTextSearch),
    (EPublishedFileQueryType.RankedByPlaytimeTrend),
    (EPublishedFileQueryType.RankedByTotalPlaytime),
    (EPublishedFileQueryType.RankedByAveragePlaytimeTrend),
    (EPublishedFileQueryType.RankedByLifetimeAveragePlaytime),
    (EPublishedFileQueryType.RankedByPlaytimeSessionsTrend),
    (EPublishedFileQueryType.RankedByLifetimePlaytimeSessions),
    (EPublishedFileQueryType.RankedByInappropriateContentRating)
])
    .transform((val) => parseInt(val, 10)).pipe(z.number().int().min(0).max(19, 'query_type must be between 0 and 19'))

const PublishedFileServiceQueryFilesRequestParamsSchema = z.object({
    // key: z.string().min(1, 'API key is required'),
    // query_type: EPublishedFileQueryTypeSchema,
    page: z.number().int().min(1).default(1).optional(),
    cursor: z.string().optional(),
    numperpage: z.number().int().min(1).default(10).optional(),
    creator_appid: z.number().int().optional(),
    appid: z.number().int().optional(),
    requiredtags: z.array(z.string()).optional(),
    excludedtags: z.array(z.string()).optional(),
    match_all_tags: z.boolean().default(true).optional(),
    required_flags: z.array(z.string()).optional(),
    omitted_flags: z.array(z.string()).optional(),
    search_text: z.string().optional(),
    filetype: z.number().int().min(0).optional(),
    child_publishedfileid: z.string().regex(/^\d+$/, 'child_publishedfileid must be a numeric string').optional(),
    days: z.number().int().min(1).optional(),
    include_recent_votes_only: z.boolean().default(false).optional(),
    cache_max_age_seconds: z.number().int().min(0).default(0).optional(),
    language: z.number().int().min(0).optional(),
    required_kv_tags: z.record(z.string(), z.string()).optional(),
    taggroups: z.array(z.string()).optional(),
    date_range_created: z.string().optional(),
    date_range_updated: z.string().optional(),
    only_trusted_content: z.boolean().default(false).optional(),
    only_ids: z.boolean().default(false).optional(),
    return_vote_data: z.boolean().default(false).optional(),
    return_tags: z.boolean().default(false).optional(),
    return_kv_tags: z.boolean().default(false).optional(),
    return_previews: z.boolean().default(false).optional(),
    return_children: z.boolean().default(false).optional(),
    return_short_description: z.boolean().default(false).optional(),
    return_for_sale_data: z.boolean().default(false).optional(),
    return_metadata: z.boolean().default(false).optional(),
    return_playtime_stats: z.number().int().min(0).optional(),
    strip_description_bbcode: z.boolean().default(false).optional(),
    return_reactions: z.boolean().default(false).optional(),
    startindex_override: z.number().int().min(0).optional(),
    desired_revision: z.number().int().min(0).max(1, 'desired_revision must be 0 or 1').optional(),
    revision: z.number().int().min(0).max(2, 'revision must be between 0 and 2').optional()
}).strict();

type IPublishedFileServiceQueryFilesRequestParams = z.infer<typeof PublishedFileServiceQueryFilesRequestParamsSchema>

// Schema for individual tag objects
const SteamWorkshopTagSchema = z.object({
    tag: z.string(),
    display_name: z.string(),
});

// Main schema for the Steam Workshop search result
const SteamWorkshopSearchResultItemSchema = z.object({
    result: z.number(), // Assuming 'result' is a number based on context
    publishedfileid: z.string(),
    creator: z.string(),
    creator_appid: z.number(),
    consumer_appid: z.number(),
    consumer_shortcutid: z.number(),
    filename: z.string(),
    file_size: z.string(), // Stored as string in the example
    preview_file_size: z.string(), // Stored as string in the example
    preview_url: z.string().url(),
    url: z.string(),
    hcontent_file: z.string(),
    hcontent_preview: z.string(),
    title: z.string(),
    short_description: z.string(),
    time_created: z.number(),
    time_updated: z.number(),
    visibility: z.number(),
    flags: z.number(),
    workshop_file: z.boolean(),
    workshop_accepted: z.boolean(),
    show_subscribe_all: z.boolean(),
    num_comments_public: z.number(),
    banned: z.boolean(),
    ban_reason: z.string(),
    banner: z.string(),
    can_be_deleted: z.boolean(),
    app_name: z.string(),
    file_type: z.number(),
    can_subscribe: z.boolean(),
    subscriptions: z.number(),
    favorited: z.number(),
    followers: z.number(),
    lifetime_subscriptions: z.number(),
    lifetime_favorited: z.number(),
    lifetime_followers: z.number(),
    lifetime_playtime: z.string(), // Stored as string in the example
    lifetime_playtime_sessions: z.string(), // Stored as string in the example
    views: z.number(),
    num_children: z.number(),
    num_reports: z.number(),
    tags: z.array(SteamWorkshopTagSchema),
    language: z.number(),
    maybe_inappropriate_sex: z.boolean(),
    maybe_inappropriate_violence: z.boolean(),
    revision_change_number: z.string(), // Stored as string in the example
    revision: z.number(),
    ban_text_check_result: z.number(),
});

const SteamWorkshopSearchResultsSchema = z.object({
    response: z.object({
        total: z.number(),
        publishedfiledetails: z.array(SteamWorkshopSearchResultItemSchema)
    })
})

// Type definitions
type SteamWorkshopTag = z.infer<typeof SteamWorkshopTagSchema>;
type SteamWorkshopSearchResultItem = z.infer<typeof SteamWorkshopSearchResultItemSchema>;
type SteamWorkshopSearchResults = z.infer<typeof SteamWorkshopSearchResultsSchema>;

export { SteamWorkshopSearchResultItemSchema, SteamWorkshopSearchResultsSchema, SteamWorkshopTagSchema, PublishedFileServiceQueryFilesRequestParamsSchema as IPublishedFileServiceQueryFilesRequestParamsSchema };
export type { SteamWorkshopTag, SteamWorkshopSearchResultItem, SteamWorkshopSearchResults, IPublishedFileServiceQueryFilesRequestParams };
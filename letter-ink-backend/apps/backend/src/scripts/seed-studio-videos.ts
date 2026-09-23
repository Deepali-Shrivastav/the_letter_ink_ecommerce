import { ExecArgs } from "@medusajs/framework/types"
import BlogModuleService from "../modules/blog/service"
import { BLOG_MODULE } from "../modules/blog"
import { blogVideoToPostPayload } from "../api/common/blog-video-helper"

export default async function seedStudioVideos({ container }: ExecArgs) {
  const blogModuleService: BlogModuleService = container.resolve(BLOG_MODULE)

  const studioVideos = [
    {
      title: "Dipping into 24k gold leaf gouache in slow motion",
      handle: "video-gold-leaf-gouache-slowmo",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuChs4cz1xrWv-z47HhzbZgOGWXcXgHUHjKS8rdIKGYmSrkIpbSBeIof32OPBl5A0b5VlliHQQPvaH-PoyKDog-SHBtA0zOSk4YGTplP-vOolCc8R6_twNwFIvExZEOJNB3b1wsIEFjK_QoninTzeL9Us7nXQ80l79B8SvxXOsFHYtGuuRq4eIlJHjPF9_YqyKwYjnerduo5AJHq8J1__L4MACZuzOZm-FbCsnLvcMC9R2k2Bh8gH_U",
      format: "portrait" as const,
      category: "reels" as const,
      badge: "Instagram Reel",
      duration: "0:34",
      views: "48.2k Views",
      caption: "#calligraphymotion #gildedink #maharashtrastudio",
    },
    {
      title: "Capillary action of sumi ink on 320 GSM Indian Khadi paper.",
      handle: "still-sumi-ink-capillary-action",
      video_url: "",
      thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDILBvJvTP7pFN8Q8AB9yn6fJknIwSIg0T5igpUeSzCrbuXGc5UgP6Txh_dtwI4pQ53tdKmnG4clSwrW88oSvqK8d5Nmov3F4EYnkgxEU7-nRdxUsfESM7DITV60d3cHYW8sMZqqUERkB0M6DPhRTe6RMHDrXw4onFBpBuo3_g__Kun13vb_y2wPKgqnM435pz0r-cT1ggqjKVx6529MlChAAAWgt3nRY4ygtlF5Dr8OVceHZ1hxg",
      format: "still" as const,
      category: "stills" as const,
      badge: "Macro Study #41",
      duration: "",
      views: "Khadi Paper",
      caption: "Natural cotton deckle edge paper texture study",
    },
    {
      title: "Copperplate capital “A” flourishing on handmade cotton envelope",
      handle: "video-copperplate-capital-a-flourishing",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp7YXt3ZfbD-bk1UOrXMkgzYdcdFQpJN2LpGrCgRlGhJKZpOg40TBJOGavEyycgZoj4xoNKmTGi8U4Bq3fcV6hRfcSV6tSvvBRtiCbRdvoPl9iOwWz5TVgg3a9aVwpmr8Fhi_5WI3-NhBOfxPKSMEPp17J1fRjukn1qejz0Jdk1ro6Py5iOyjn0JcqS0nI_1ha9GWNTgLAyVW00VjPr6lwlPhZi3Fpi6brhX-0bNXmcP6ZgNxXbBY",
      format: "portrait" as const,
      category: "reels" as const,
      badge: "Process Reel",
      duration: "0:45",
      views: "29.1k Views",
      caption: "#copperplate #obliquepen #pointedpen",
    },
    {
      title: "Atelier Session: Drilling floral monograms onto crystal perfume flutes",
      handle: "video-drilling-monograms-perfume-flutes",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHMy6zUuhgQo5FIj9guot2ofYVdg5n8NTkO-6iGZ4upP6reT-sG7rqxxeu8ZWcSJ80F1F3AkXWu2o-pZuOM8pQD5dl3-1DXM6Q9XXaaeXxgMlBwFTtmHQ1dvjDNXdKLMkKjCO8WL-EXQx79w_2KlwSZhEOTlNrtcQ_2QrN5r1mSgunUF-FxkOQJTFOzWiSY7fVia4NUd7RcQTfGGtrtQ-wH9UHvOyvkLYRkYZNUm4aoJCnTcQDCg4",
      format: "landscape" as const,
      category: "shorts" as const,
      badge: "Studio Cinema",
      duration: "2:15 Mastercut",
      views: "Royal Gala Commission",
      caption: "Live personalized event commission for royal gala.",
    },
    {
      title: "The Daily Scribe Arsenal",
      handle: "still-daily-scribe-arsenal",
      video_url: "",
      thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCswTqtZmDwwP8ku2wExBs6i96W9Q5_Ysa1iJu_X0iK8XmZPdzKIFc_qpRjGJgasy9Due7qnqcVrmjNYJYI6lcVAiQR2QWEiKiJgalQLhdd2JHtqGJPvAagCBNGXeBjP9u-yX2R5EkjxYC4CMsAN2KNA8KVjhvwHTJFA01h8Dq6reW4UEvdcRSToZ1gs6_SJ6kYzzDKgXqy4sdP-dznf3PMljaBnMg25gpQBcGY9lK7YBjU6iuiEz8",
      format: "still" as const,
      category: "stills" as const,
      badge: "Atelier Tools",
      duration: "",
      views: "Gillott 303 Nibs",
      caption: "Overhead flatlay composition of rare vintage Gillott 303 nibs, turned zebrawood oblique penholder.",
    },
    {
      title: "48 Hours in the Bhusawal Atelier with our Master Scribe",
      handle: "video-48-hours-bhusawal-atelier",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMhf7vc3vMqaDr6qFjN4dnk-rpdD596UfLWJRAiVsUZN60AteKEG7UxtzLybWKeLFGA1563_fdK7nv-rTqVmGMVUvdPOSpz_3UFB6tfJrNh9BmPoVvJHpteW7MUqA2eXx3N5zynSU_GZB882vXbDNfC2pVVoLMaZI8V6OzxNPwO8FupfpZHgtTUirlI3qiCk4lAwHW0l9ZFYdx055Mw5vACGW1vvYCJTZTmpuTirJ6iqrWp7ZLn6g",
      format: "landscape" as const,
      category: "shorts" as const,
      badge: "Mini Documentary",
      duration: "5:20 Runtime",
      views: "Bhusawal Studio Archives",
      caption: "Cinematic still from documentary showing calligraphy artisan grinding natural raw pigments on slate stone.",
    },
    {
      title: "Melting forest sage beeswax with brass initial stamp",
      handle: "video-melting-forest-sage-beeswax",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyLb2absOj549RlAABGZyqZiALsHcjcr2thyn6uWyluP18s1MbAiWDII_yNSp31d5yI_fyXclEyrVwTuz2Ac7OjE0AMC2oK0f9QrD5CndBYjCGKx4tr0kyo6K8OgL9pzFBt31aRWwU1ifx3ppWl5Oys-zv6jEfY6WKvID-JzLgyR8vLKeoiGhItfUpRit1OaLy6LvqcCK2iW0wxWPXI46PU4jppraVtOg00TdSbWXXN-UbdqDYRQM",
      format: "portrait" as const,
      category: "reels" as const,
      badge: "Wax Seal Reel",
      duration: "0:28",
      views: "18.5k Plays",
      caption: "#waxseal #monogram #calligraphyseal",
    },
    {
      title: "Illuminated wedding vow folios in raw silk.",
      handle: "still-illuminated-wedding-vows-silk",
      video_url: "",
      thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTI5Z4RsFznIS5u3CQ12dpZiD7C59bUbDi_Q8HFhb0VG-MAVr7qDLWztBYXlJc0ymLabmE1kEgJ5eZ5IzckhDYlBmkgfKXxprF5GNMIjYmRL4FFfiG_QAEAhuSMUZ9edqnyxFR2aB6hmSXTh9uC3p02Oz71-3pW4Bu2XH2gA9htOIHYKAFeBlPktG_-lRlTucXgX9ElMc6hqDJv-bPL4CNrecypfWsexQt_4NNvt-iDHOUV7wBtx4",
      format: "still" as const,
      category: "stills" as const,
      badge: "Archive Suite 109",
      duration: "",
      views: "Commission Suite",
      caption: "Vertical photograph of bespoke illuminated wedding vow booklets tied in raw mulberry frayed silk ribbons.",
    },
    {
      title: "Packing a royal bespoke name frame in triple-cushioned wooden crating",
      handle: "video-packing-royal-bespoke-name-frame",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
      thumbnail_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqyyBo_Db3cSDzMkJfPRk49mW_33wNR024frU7E9BMGT_p7tlSVlCZhPwmgBXJyUa5pL0v1tcI7av4YiydqHErcK8K31ggz9Yjm4vCyB1_MaS3LKuqVTcWMuBqdQV-wNfV1NGGaCcDkISB-k24wIB07jtnh6Dps-ATKwDaRK5ucZnRduJcjGNl3zB5Z6zOEXOk6t80V4U5I2dniHpronp9W0QR2CnnVZV8_HwQJ14JIRTuRnRzLg8",
      format: "portrait" as const,
      category: "reels" as const,
      badge: "Dispatch Reel",
      duration: "0:39",
      views: "34.8k Views",
      caption: "#packaging #keepsake #artdelivery",
    },
  ]

  console.log("Seeding studio motion videos and visual repositories...")

  for (const item of studioVideos) {
    const existing = await blogModuleService.listPosts({ handle: item.handle })
    if (existing.length === 0) {
      const payload = blogVideoToPostPayload(item)
      await blogModuleService.createPosts(payload as any)
      console.log(`Created studio item: [${item.format.toUpperCase()}] ${item.title}`)
    } else {
      console.log(`Studio item already exists: ${item.title}`)
    }
  }

  console.log("Finished seeding studio motion videos.")
}

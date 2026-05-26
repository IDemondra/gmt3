import { Reveal } from '../../components/ui/Reveal.jsx';
import { Footer } from '../../components/Footer.jsx';

/**
 * Static Upcoming Events page (detail view for "OFFRE" / "VOIR TOUT").
 * The markup mirrors the design from `code1.html` and uses the existing
 * Tailwind configuration and UI primitives (Button, Reveal, etc.).
 */
export function Events() {
    return (
        <>
        <main class="flex-grow flex flex-col pt-8 pb-section-gap">
            {/* Page Header */}
            <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mb-8">
                <h1 class="font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 text-on-background mb-4 uppercase tracking-tighter">
                    UPCOMING EVENTS
                </h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                    Discover thrilling adventures and exclusive expeditions across the wild landscapes of Madagascar. Book your spot before they fill up.
                </p>
            </section>

            {/* Filter Bar */}
            <section class="bg-on-secondary-fixed text-on-primary px-margin-mobile md:px-margin-desktop py-4 mb-12">
                <div class="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div class="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <span class="font-label-caps text-label-caps text-surface-variant">CATEGORIES:</span>
                        <button class="font-button text-button text-primary-container border-b-2 border-primary-container pb-1 transition-colors">ALL</button>
                        <button class="font-button text-button text-surface-variant hover:text-primary-container transition-colors">TREKKING</button>
                        <button class="font-button text-button text-surface-variant hover:text-primary-container transition-colors">WILDLIFE</button>
                        <button class="font-button text-button text-surface-variant hover:text-primary-container transition-colors">CULTURE</button>
                    </div>
                    <div class="flex items-center gap-4 w-full md:w-auto justify-end">
                        <select class="bg-transparent text-on-primary font-button text-button px-4 py-2 focus:outline-none focus:border-primary-fixed appearance-none cursor-pointer border-b-2">
                            <option class="text-on-background" value="date">SORT BY DATE</option>
                            <option class="text-on-background" value="price">SORT BY PRICE</option>
                        </select>
                        <button class="bg-primary-container text-on-primary font-button text-button px-6 py-2 hover:bg-[#C62828] transition-colors flex items-center gap-2 rounded-lg shadow-md hover:shadow-lg">
                            <span class="material-symbols-outlined" data-icon="filter_list">filter_list</span>
                            FILTRER
                        </button>
                    </div>
                </div>
            </section>

            {/* Event Grid */}
            <section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mb-12">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    {/* Event Card 1 */}
                    <article class="bg-on-secondary-fixed flex flex-col group relative overflow-hidden">
                        <div class="relative h-64 overflow-hidden">
                            <div class="absolute inset-0 bg-black/20 z-10"></div>
                            <img alt="Tsingy de Bemaraha" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp-WIeKr_a7VCmtcqnIFUlqRrFWsSSgE1Flw-1ab94TTrxSmlltLXWtOaqQ2_Uy3L_6BwllDGxshfnJ_emrhTdUrZKhnY8OOJ3shRHtfFn7Riop9OlCPRqMt2GSkToYX4pjlV8m-q78VdV6-rNYMckztRxBOwNF72FgxFsBC5S2nUjLVy6LD9ELFCWhvMYg-gQqnm4hRU_b5ofzaNe2VcAa_6yfhJtoUcFIsTEyRVko1hj2XtHVk_ocv5egThycNYJ3agjXgBrDaM" />
                            <div class="absolute top-4 left-4 z-20 bg-primary-container text-on-primary font-label-caps text-label-caps px-3 py-1 uppercase">EXTREME TREK</div>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <div class="flex items-center gap-2 text-surface-variant font-label-caps text-label-caps mb-2">
                                <span class="material-symbols-outlined text-primary-container" data-icon="calendar_month">calendar_month</span>
                                OCT 15 - 22, 2024
                            </div>
                            <h3 class="font-h3 text-h3 text-primary-container mb-2 uppercase">TSINGY PEAK CHALLENGE</h3>
                            <p class="font-body-md text-body-md text-surface-variant mb-6 flex-grow">Conquer the razor-sharp limestone forests. A grueling but rewarding expedition for experienced hikers.</p>
                            <div class="flex items-center justify-between mt-auto">
                                <span class="font-h3 text-h3 text-on-primary">€1,200</span>
                                <button class="bg-primary-container text-on-primary font-button text-button px-6 py-2 hover:bg-[#C62828] transition-colors rounded-lg shadow-md hover:shadow-lg">RÉSERVER</button>
                            </div>
                        </div>
                    </article>

                    {/* Event Card 2 */}
                    <article class="bg-on-secondary-fixed flex flex-col group relative overflow-hidden">
                        <div class="relative h-64 overflow-hidden">
                            <div class="absolute inset-0 bg-black/20 z-10"></div>
                            <img alt="Lemur in wild" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7Tj3wID0H6VbGQcK05TnegTtu6Fa5S7CQiR1nRH3Vn2FgLbrg8G15VQOeSO0FSZqMIP9J6O7bP-yDHQMv3PNl0QvWwNprl4uEJxW7Wb8TGrFG-EGyEBO4pII2znSImeT7xn4RWAau2XtDNQcT7YDNMLU8_YANrCTImaKpb-Rp5285BIGTCUoUQBGbclD6Zcc9JkwzQfwNbUA_qp9W9FbiAhIxPzd5gGPWX-2JE-jW3vcfPqcdO9EKtdGFeZK_LaiOC6hQhRWpu94" />
                            <div class="absolute top-4 left-4 z-20 bg-primary-container text-on-primary font-label-caps text-label-caps px-3 py-1 uppercase">WILDLIFE</div>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <div class="flex items-center gap-2 text-surface-variant font-label-caps text-label-caps mb-2">
                                <span class="material-symbols-outlined text-primary-container" data-icon="calendar_month">calendar_month</span>
                                NOV 02 - 05, 2024
                            </div>
                            <h3 class="font-h3 text-h3 text-primary-container mb-2 uppercase">LEMUR TRACKING EXPEDITION</h3>
                            <p class="font-body-md text-body-md text-surface-variant mb-6 flex-grow">Venture deep into Andasibe to track rare lemur species in their natural, untamed habitat.</p>
                            <div class="flex items-center justify-between mt-auto">
                                <span class="font-h3 text-h3 text-on-primary">€450</span>
                                <button class="bg-primary-container text-on-primary font-button text-button px-6 py-2 hover:bg-[#C62828] transition-colors rounded-lg shadow-md hover:shadow-lg">RÉSERVER</button>
                            </div>
                        </div>
                    </article>

                    {/* Event Card 3 */}
                    <article class="bg-on-secondary-fixed flex flex-col group relative overflow-hidden">
                        <div class="relative h-64 overflow-hidden">
                            <div class="absolute inset-0 bg-black/20 z-10"></div>
                            <img alt="Baobab Avenue" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgYJTEHnnc--WHOQ2V2aJ0luE0SsWDUG_KvejUxd98vb4G0Cs179gmDf1YjKVOyDDFNn4y6kCuugQrMNPx5zNeqma25kEvobaTngOO0K9GG-eA1KsmUUdVXcEhEDNriKc3wtdPnL_jlQYaYh0-UPRTRBIavCwRWDg9s8sfnRfMTIlnLeAxcKrfReqf0ycC7VJY0EBGcrTPi9y8lGRP7mdmYdif7tk3IXMHUfKHgNazhIs9owP7e0q9mj6sU0-a3PIp4FoS2eXiYxQ" />
                            <div class="absolute top-4 left-4 z-20 bg-primary-container text-on-primary font-label-caps text-label-caps px-3 py-1 uppercase">PHOTOGRAPHY</div>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <div class="flex items-center gap-2 text-surface-variant font-label-caps text-label-caps mb-2">
                                <span class="material-symbols-outlined text-primary-container" data-icon="calendar_month">calendar_month</span>
                                DEC 10 - 14, 2024
                            </div>
                            <h3 class="font-h3 text-h3 text-primary-container mb-2 uppercase">BAOBAB SUNSET MASTERCLASS</h3>
                            <p class="font-body-md text-body-md text-surface-variant mb-6 flex-grow">Join renowned photographers to capture the iconic Avenue of the Baobabs under spectacular lighting conditions.</p>
                            <div class="flex items-center justify-between mt-auto">
                                <span class="font-h3 text-h3 text-on-primary">€800</span>
                                <button class="bg-primary-container text-on-primary font-button text-button px-6 py-2 hover:bg-[#C62828] transition-colors rounded-lg shadow-md hover:shadow-lg">RÉSERVER</button>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {/* Pagination */}
            <section class="flex justify-center items-center gap-4 py-8 bg-on-secondary-fixed mt-auto border-y-2 border-primary-container">
                <button class="text-surface-variant hover:text-primary-container transition-colors p-2 flex items-center justify-center">
                    <span class="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
                </button>
                <button class="font-button text-button text-primary-container border-b-2 border-primary-container w-8 text-center pb-1">1</button>
                <button class="font-button text-button text-surface-variant hover:text-primary-container transition-colors w-8 text-center pb-1">2</button>
                <button class="font-button text-button text-surface-variant hover:text-primary-container transition-colors w-8 text-center pb-1">3</button>
                <span class="text-surface-variant">...</span>
                <button class="font-button text-button text-surface-variant hover:text-primary-container transition-colors w-8 text-center pb-1">8</button>
                <button class="text-surface-variant hover:text-primary-container transition-colors p-2 flex items-center justify-center">
                    <span class="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                </button>
            </section>
        </main>
        <Footer />
        </>
    );
}

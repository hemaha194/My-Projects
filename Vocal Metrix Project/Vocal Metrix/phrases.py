import spacy
import pytextrank
import re

# example text
text="From the 1650s through the late 18,, hundreds European colonists descended on South Africa. First, Dutch and later British forces sought to claim the region for themselves, with their struggle becoming even more aggressive after discovering the area's abundant natural resources. In their ruthless scramble, both colonial powers violently removed numerous indigenous communities from their ancestral lands. Yet despite these conflicts, the colonizers often claimed they were settling in empty land, devoid of local people. These reports were corroborated in letters and travelogues by various administrators, soldiers and missionaries. Maps were drawn reflecting these claims, and prominent British historians supported this narrative. Publications codifying the Socalled empty land theory had three central arguments: First, most of the land being settled by Europeans had no established communities or agricultural infrastructure. Second, any African communities that were in those regions had actually entered the area at the same time as Europeans, so they didn't have an ancestral claim to the land. And third, since these African communities had probably stolen the land from earlier, no longer present indigenous people, the Europeans were within their rights to displace these African settlers. The problem is that all three of these arguments were completely false. Almost none of this land was empty and Africans had lived here for millennia. Indigenous South Africans simply had a different practice of land ownership From the Dutch and British land belonged to families or groups, not individuals, and even that ownership was more focused on the land's agricultural products than the land itself. Community leaders would distribute seasonal land rights allowing various nomadic groups to graze cattle or forage for vegetation. Even the groups that did live in large agricultural settlements didn't believe they owned the land as private property. But the colonizing Europeans had no respect for this system of ownership. They concluded the land belonged to no one and could therefore be divided amongst themselves. In this context, claims that the land was empty were an ignorant oversimplification of a much more complex reality. But the empty land theory allowed British academics to rewrite history and minimize native populations. In 1894,, the European parliament in Cape Town took this exploitation even further by passing the Glen Gray Act. This decree made it functionally impossible for native Africans to own land, shattering the system of collective tribal ownership and creating a class of landless people. to justify the theft, Europeans painted the locals as barbarians who lacked the capacity for reason and were better off being ruled by the colonizers. This strategy of stripping locals of their right to ancestral lands and casting native people as savages has been employed by many colonizers, Now known as the Empty Land Myth. This is a wellestablished technique in the colonial playbook and its impact can be found in the history of many countries, including Australia, Canada and the United States, And in South Africa. The influence of this narrative can be traced directly to a brutal campaign of institutionalized racism. Sparred from their lands, the once self sufficient population struggled as migrant laborers and miners on European owned property. The law forbade them from working certain skilled jobs and forced Africans to live in racially segregated areas. Over time, these racist policies intensified, mandating separation in urban areas, restricting voting rights and eventually building to apartheid. Under this system, African people had no voting rights and the education of native Africans was overhauled to emphasize their legal and social subservience to white settlers. This state of legally enforced racism persisted through the early 1990s and throughout this period, Colonists frequently invoked the empty land theory to justify the unequal distribution of land. South African resistance movements fought throughout the 20th century to gain political and economic freedom And since the 1980s, south African scholars have been using archaeological evidence to correct the historical record. Today, South African schools are finally teaching the region's true history, But the legacy of the empty land myth still persists as one of the most harmful stories ever told."

# load a spaCy model, depending on language, scale, etc.
nlp = spacy.load("en_core_web_sm")
# add PyTextRank to the spaCy pipeline
nlp.add_pipe("textrank")

def count_phrases(text):
    doc = nlp(text)
    # print(doc)
    phrases1 = []
    for phrase in doc._.phrases[:]:
    
        data_str = str(phrase)
        # print(phrase)
        # Define a regular expression pattern to extract the 'text' data
        pattern = r"text='(.*?)'"

        # Use re.search to find the pattern in the data string
        result = re.search(pattern, data_str)

        if result:
            text_data = result.group(1)  # Extract the content inside the single quotes
        else:
            text_data = None
        # print(phrase, text_data, text_data.split(' '))
    
        if(len(text_data.split(' ')) > 1):
            phrases1.append(text_data)
    return phrases1, len(phrases1)

# phraseCount = count_phrases(text)
# print("phrase Count :", phraseCount)
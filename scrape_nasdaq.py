#import dependancies
import pandas as pd


def scrape_info():

    wiki_url = 'https://en.m.wikipedia.org/wiki/Nasdaq-100'

    #Parse data from the html into a beautifulsoup object

    nd_100_df=pd.read_html(wiki_url)[3] #3 returns the table we are searching for

    nd_100_json = nd_100_df.to_json()

    # Return results
    return nd_100_json
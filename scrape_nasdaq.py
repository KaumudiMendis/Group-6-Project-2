#import dependancies
import pandas as pd


def scrape_info():

    wiki_url = 'https://en.m.wikipedia.org/wiki/Nasdaq-100'

    #Parse data from the html into a beautifulsoup object

    nd_100_df=pd.read_html(wiki_url)[3] #3 returns the table we are searching for


    nd_100_html = nd_100_df.to_html()

    nasdaq_data = {"table":nd_100_html}

    # Return results
    return nasdaq_data
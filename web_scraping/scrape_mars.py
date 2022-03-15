#import dependancies
import pandas
from splinter import Browser
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager


def scrape_info():
    # Set up Splinter
    executable_path = {'executable_path': ChromeDriverManager().install()}
    browser = Browser('chrome', **executable_path, headless=False)

    #Find news title and text paragraph

    #Use url and have the browser visit
    news_url = "https://redplanetscience.com/"
    browser.visit(news_url)

    # Scrape news page into Soup
    html = browser.html
    news_soup = BeautifulSoup(html, "html.parser")

    #Create variables to hold the title and paragraph
        #Use .get_text() to bring the text into the variable
    news_title = news_soup.find('div',class_="content_title").get_text()
    news_p = news_soup.find('div',class_="article_teaser_body").get_text()

    #Find featured image

    #Use url and have the browser visit
    feat_img_base = "https://spaceimages-mars.com/"
    browser.visit(feat_img_base)

    #Have Jupyter click the "Full Image" button on the site
    browser.links.find_by_partial_text('FULL').click()

    # Scrape page into Soup
    feat_img_html = browser.html
    feat_img_soup = BeautifulSoup(feat_img_html, "html.parser")

    #Find the image location using soup
    feat_img_loc= feat_img_soup.find("img", class_="fancybox-image")["src"]

    #Combine the original base url and the location of the image url to create the whole link
    feat_img_url= feat_img_base+feat_img_loc

    #Find Mars Facts table

    #Use url and have the browser visit
    table_url= "https://galaxyfacts-mars.com/"

    #Find the image location using soup
    data_table= pandas.read_html(table_url)[0]

    #Format table through renaming of the headers
    data_table=data_table.rename(columns={
        0:"Description",
        1:"Mars",
        2:"Earth"
    })

    #Set "Description" as index to further match expected output
    data_table=data_table.set_index("Description")

    #As the table matches the expected output we can now transform it to html
        #store as a variable to use later
    table_html = data_table.to_html()

    #Find hemisphere images

    #Use url and have the browser visit
    hemi_url = "https://marshemispheres.com/"
    browser.visit(hemi_url)

    #Create list to hold the title and image urls
    hemi_img_urls=[]

    #For loop errors out after 4, so run that many times
    for i in range(0,4):
        #Create a dictionary each loop to append to the list
        hemi_dict={}
        
        #Find the i-th image link for the hemisphere and click
        browser.find_by_css('a.product-item img')[i].click()
        
        
        #Scrape in the title from it's h2 element into dictionary
        hemi_dict['title']=browser.find_by_css('h2.title').text
        
        #Scrape image url in by it's element img into dictionary
        hemi_dict['img_url']=browser.find_by_css('img.wide-image')['src']
        
        #Append dictionary into the list
        hemi_img_urls.append(hemi_dict)
        
        #Have splinter move back to home page
        browser.back()

    # Store data in a dictionary
    mars_data = {
        "news_title": news_title,
        "news_p": news_p,
        "feat_img_url": feat_img_url,
        "table_html": table_html,
        "hemi_img_urls": hemi_img_urls
    }

    # Close the browser after scraping
    browser.quit()

    # Return results
    return mars_data

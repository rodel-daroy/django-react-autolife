"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from threading import Thread

import os

import requests
from moviepy.editor import VideoFileClip

from autolife.local_settings import MEDIA_URL
from autolife.settings import BASE_DIR, AWS_STORAGE_BUCKET_NAME, AWS_S3_CUSTOM_DOMAIN

VIDEO_START = 0
VIDEO_END = 5
SIZES = [{"1920": 1920}, {"960": 960}, {"640": 640}]
WIDTH = {1920: 1080, 960: 540, 640:480}


class GenerateThumbnail(Thread):

	def __init__(self, path):
		super().__init__()
		self.path = path


	def run(self):
		clip = VideoFileClip(self.path)
		sub_clip = clip.subclip(0, 5)
		sub_clip.write_videofile("new.mp4")



class VideoThumbnailer(Thread):
	"""
	Generates video thumbnails and upload to S3 bucket
	"""
	def __init__(self, path, start=0, end=5):
		super().__init__()
		self.path = path
		self.end_time = end
		self.start_time = start

	def run(self):
		clip = VideoFileClip(self.path).without_audio()
		filename = clip.filename.split("/")[-1] # Getting Filename
		# Check for s3 existence
		clip = clip.subclip(self.start_time, self.end_time)
		for each_size in SIZES:
			for str_path, int_width in each_size.items():
				new_clip = clip.resize(width=int_width, height=WIDTH[int_width])
				new_clip.write_videofile(filename)
				os.system(
					"aws s3 cp " + BASE_DIR + "/" + filename + " s3://" + AWS_STORAGE_BUCKET_NAME + "/"+str_path+"/ --acl public-read")
				os.remove(filename)
		#clip.write_videofile(filename)
		#print(BASE_DIR+"/"+filename)
		#os.system("aws s3 cp "+BASE_DIR+"/"+filename+" s3://"+AWS_STORAGE_BUCKET_NAME+"/thumbnails/ --acl public-read")
		#os.remove(filename)
		#print("successfully converted")
		# S3 upload


class LambdaThumbnailer(Thread):
	"""
	Lambda will call this class for generating video clips
	"""
	def __init__(self, file, dimensions, clip_time, path):
		super().__init__()
		self.filename = file
		self.path = MEDIA_URL + 'uploads/'+file
		self.start_time = int(clip_time[0])
		self.end_time = int(clip_time[-1])
		self.height = dimensions[0]
		self.width = dimensions[1]
		self.path_dir = path.split('/')[0]+'/'

	def run(self):
		clip = VideoFileClip(self.path)
		# Check for s3 existence
		clip = clip.subclip(self.start_time, self.end_time)
		clip.write_videofile(self.filename)
		print(BASE_DIR + "/" + self.filename)
		os.system(
			"aws s3 cp " + BASE_DIR + "/" + self.filename + " s3://" + AWS_STORAGE_BUCKET_NAME +'/'+ self.path_dir + " --content-type video/mp4 --acl public-read")
		os.remove(self.filename)
		print("successfully converted")


def filterCheck(filterBody):
   if(filterBody is None or len(filterBody) == 0 or filterBody['name'] == "" or filterBody['name'] is None):
       return True
   else:
       return False
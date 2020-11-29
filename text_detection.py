import numpy as np
import cv2
import random


def get_contour_precedence(contour, cols):
    origin = cv2.boundingRect((contour))
    return origin[1]*cols+origin[0]

def get_text_regions(scan, save=False):
    ret, bin_inv = cv2.threshold(scan, 180, 255, cv2.THRESH_BINARY_INV)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (21,21))
    dilated = cv2.dilate(bin_inv, kernel, iterations=5)
    if save:
        cv2.imwrite('./img_debug/5_TR_dilated.jpg', dilated)
    contours, hierarchy = cv2.findContours(dilated,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    text_regions = []
    cnts = []
    i=0
    min_area = 50000
    contours = sorted(contours, key=lambda x:get_contour_precedence(x, scan.shape[1]))
    for cnt in contours:
        area=cv2.contourArea(cnt)
        print('area',area)
        # print('area = ' + str(area))
        if area > min_area:
            [x, y, w, h] = cv2.boundingRect(cnt)
            # test si la zone détecter est en bordure de l'image (--> problème du scan qui laisse des lignes noires apparaitre sur le bord du document)
            test_horizontal = max(w,h)== w and (y != 0 and y!=scan.shape[0]-h)
            test_vertical = max(w,h)== h and (x != 0 and x!=scan.shape[1]-w)
            if test_horizontal or test_vertical:
                cropped = scan[y :y +  h , x : x + w]
                if save:
                    cv2.imwrite('./img_debug/6_text_regions_'+str(i)+'.jpg', cropped)
                text_regions.append(cropped)
                cnts.append(cnt)
                i+=1
    if save:
        copy = scan.copy()
        cv2.drawContours(copy, cnts, -1, (0,0,255), 2)
        cv2.imwrite('./img_debug/5_2_scan_TR_contour.jpg', copy)
    return text_regions

def get_lines(text_region, save=False):
    i = int((random.random()*5400)%128)
    ret, bin_inv = cv2.threshold(text_region, 180, 255, cv2.THRESH_BINARY_INV)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25,1))
    dilated = cv2.dilate(bin_inv, kernel, iterations=5)
    if save:
        cv2.imwrite('./img_debug/7_TR_dilated_text_regions'+str(i)+'.jpg', dilated)
    contours, hierarchy = cv2.findContours(dilated,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    lines = []
    min_area = 5000
    contours = sorted(contours, key=lambda x:get_contour_precedence(x, text_region.shape[1]))
    k = 0
    for cnt in contours:
        area=cv2.contourArea(cnt)
        # print('area = ' + str(area))
        if area > min_area:
            [x, y, w, h] = cv2.boundingRect(cnt)
            cropped = text_region[y :y +  h , x : x + w]
            white_padding = cv2.copyMakeBorder(cropped, 15, 15, 0, 0, cv2.BORDER_CONSTANT, None, 255)
            if save:
                cv2.imwrite('./img_debug/8_lines'+str(i)+'_'+str(k)+'.jpg', white_padding)
            lines.append(white_padding)
            k+=1
    return lines

def get_words(line, save=False):
    i = int((random.random()*5400)%128)
    ret, bin_inv = cv2.threshold(line, 180, 255, cv2.THRESH_BINARY_INV)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5,25))
    dilated = cv2.dilate(bin_inv, kernel, iterations=5)
    if save:
        cv2.imwrite('./img_debug/9_TR_dilated_lines'+str(i)+'.jpg', dilated)
    contours, hierarchy = cv2.findContours(dilated,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    words = []
    min_area = 5000
    contours = sorted(contours, key=lambda x: cv2.boundingRect((x))[0])
    k = 0
    for cnt in contours:
        area=cv2.contourArea(cnt)
        if area > min_area:
            [x, y, w, h] = cv2.boundingRect(cnt)
            cropped = line[y :y +  h , x : x + w]
            white_padding = cv2.copyMakeBorder(cropped, 0, 0, 15, 15, cv2.BORDER_CONSTANT, None, 255)
            # if save:
            #     cv2.imwrite('./img_debug/10_words'+str(i)+'_'+str(k)+'.jpg', white_padding)
            words.append(white_padding)
            k+=1
    return words

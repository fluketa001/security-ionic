<?php
// Create new PHPExcel object
$objPHPExcel = new PHPExcel();

// Set properties
$objPHPExcel->getProperties()->setCreator("----- Web Server");
$objPHPExcel->getProperties()->setLastModifiedBy("-----Web Server");
$objPHPExcel->getProperties()->setTitle("Paypal payment reconciliation report");
$objPHPExcel->getProperties()->setSubject("Paypal payment reconciliation report");
$objPHPExcel->getProperties()->setDescription("Paypal payment reconciliation report");
$objPHPExcel->getProperties()->setKeywords("paypal reconcile");
$objPHPExcel->getProperties()->setCategory("Reconciliation report");

// Create a first sheet, representing sales data
$objPHPExcel->setActiveSheetIndex(0);    

// format the heading
$objPHPExcel->getActiveSheet()->setCellValue('A1', 'Paypal Reconciliation - ran on '.date('m/d/y', time()));
$objPHPExcel->getActiveSheet()->mergeCells('A1:C1');
$objPHPExcel->getActiveSheet()->setCellValue('E1', 'Date Range: '.date('m/d/Y', $oldest_transaction).' to '.date('m/d/Y', $newest_transaction));
$objPHPExcel->getActiveSheet()->mergeCells('E1:J1');
$objPHPExcel->getActiveSheet()->duplicateStyleArray(
        array(
            'font'    => array(
                'size'      => '12',
                'bold'      => true
            )
        ),
        'A1:I1'
);

// add column labels
$objPHPExcel->getActiveSheet()->setCellValue('A2', '#');
$objPHPExcel->getActiveSheet()->setCellValue('B2', 'Date');
$objPHPExcel->getActiveSheet()->setCellValue('C2', 'Name');
$objPHPExcel->getActiveSheet()->setCellValue('D2', 'Gross');
$objPHPExcel->getActiveSheet()->setCellValue('E2', 'Fee');
$objPHPExcel->getActiveSheet()->setCellValue('F2', 'Net');
$objPHPExcel->getActiveSheet()->setCellValue('G2', 'Balance');
$objPHPExcel->getActiveSheet()->setCellValue('H2', 'Class');
$objPHPExcel->getActiveSheet()->setCellValue('I2', 'Item Title');
$objPHPExcel->getActiveSheet()->setCellValue('J2', '');
$objPHPExcel->getActiveSheet()->setCellValue('K2', '#');
$objPHPExcel->getActiveSheet()->setCellValue('L2', 'Time');
$objPHPExcel->getActiveSheet()->setCellValue('M2', 'Type');
$objPHPExcel->getActiveSheet()->setCellValue('N2', 'Status');
$objPHPExcel->getActiveSheet()->setCellValue('O2', 'Transaction ID');
$objPHPExcel->getActiveSheet()->setCellValue('P2', 'Paypal Receipt ID');
$objPHPExcel->getActiveSheet()->setCellValue('Q2', '--- #');
$objPHPExcel->getActiveSheet()->setCellValue('R2', 'Counterparty');
$objPHPExcel->getActiveSheet()->setCellValue('S2', 'Reference Txn ID');
$objPHPExcel->getActiveSheet()->setCellValue('T2', 'Inv #');
echo $objPHPExcel;
?>